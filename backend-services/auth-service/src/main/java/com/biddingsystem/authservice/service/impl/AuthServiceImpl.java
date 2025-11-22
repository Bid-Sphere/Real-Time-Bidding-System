package com.biddingsystem.authservice.service.impl;

import com.biddingsystem.authservice.model.LoginRequest;
import com.biddingsystem.authservice.model.LoginResponse;
import com.biddingsystem.authservice.model.RegisterRequest;
import com.biddingsystem.authservice.model.UserEntity;
import com.biddingsystem.authservice.model.UserResponse;
import com.biddingsystem.authservice.repository.interfaces.UserRepository;
import com.biddingsystem.authservice.service.interfaces.AuthService;
import com.biddingsystem.authservice.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // Method for user registration
    @Override
    public UserResponse register(RegisterRequest request) {
        logger.info("Checking for the user before registration for user email {}", request.getEmail());

        int userCount = userRepository.emailExists(request.getEmail());
        logger.info("User count for user email {} is {}", request.getEmail(), userCount);

        if (userCount > 0) {
            throw new IllegalArgumentException("Email already exists!");
        }

        logger.info("No user found with email {}, proceeding with registration process!", request.getEmail());

        // Validate role
        if (!isValidRole(request.getRole())) {
            logger.warn("Invalid role provided: {}", request.getRole());
            throw new IllegalArgumentException("Invalid user role. Must be CLIENT, VENDOR, ORGANISATION, or FREELANCER");
        }

        // Create user entity
        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(request.getEmail().toLowerCase());
        userEntity.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userEntity.setFirstName(request.getFirstName());
        userEntity.setLastName(request.getLastName());
        userEntity.setRole(request.getRole().toUpperCase());
        userEntity.setIsActive(true);
        userEntity.setCreatedAt(LocalDateTime.now());
        userEntity.setUpdatedAt(LocalDateTime.now());

        // Save the user to the database
        Long userId = userRepository.saveUser(userEntity);

        // Fetch the saved user to get complete details
        UserEntity savedUser = userRepository.findById(userId);
        if (savedUser == null) {
            throw new RuntimeException("Failed to retrieve saved user");
        }

        logger.info("User registered successfully: {} with role: {}", request.getEmail(), request.getRole());

        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(savedUser.getRole())
                .isActive(savedUser.getIsActive())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    // Method for user login
    @Override
    public LoginResponse login(LoginRequest request) {
        logger.info("Attempting login for user: {}", request.getEmail());

        UserEntity foundUser = userRepository.findByEmail(request.getEmail());

        if (foundUser == null) {
            logger.warn("Login failed - User not found: {}", request.getEmail());
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Check if the password matches
        if (!passwordEncoder.matches(request.getPassword(), foundUser.getPasswordHash())) {
            logger.warn("Login failed - Invalid password for user: {}", request.getEmail());
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(foundUser.getEmail(), foundUser.getId().toString());

        logger.info("Login successful for user: {}", request.getEmail());

        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(foundUser.getId())
                .email(foundUser.getEmail())
                .firstName(foundUser.getFirstName())
                .lastName(foundUser.getLastName())
                .role(foundUser.getRole())
                .expiresIn(86400L) // 24 hours in seconds
                .build();
    }

    @Override
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    private boolean isValidRole(String role) {
        if (role == null) return false;

        String upperRole = role.toUpperCase();
        return upperRole.equals("CLIENT") ||
                upperRole.equals("VENDOR") ||
                upperRole.equals("ORGANISATION") ||
                upperRole.equals("FREELANCER") ||
                upperRole.equals("ADMIN");
    }
}