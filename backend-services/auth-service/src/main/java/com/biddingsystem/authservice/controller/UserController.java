package com.biddingsystem.authservice.controller;

import com.biddingsystem.authservice.model.UserEntity;
import com.biddingsystem.authservice.model.UserResponse;
import com.biddingsystem.authservice.repository.interfaces.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        logger.info("Fetching profile for user: {}", email);

        UserEntity user = userRepository.findByEmail(email);

        if (user == null) {
            logger.warn("User not found with email: {}", email);
            return ResponseEntity.notFound().build();
        }

        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();

        logger.info("Profile retrieved successfully for user: {}", email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        logger.info("Fetching user by ID: {}", id);

        UserEntity user = userRepository.findById(id);

        if (user == null) {
            logger.warn("User not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        }

        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();

        logger.info("User retrieved successfully with ID: {}", id);
        return ResponseEntity.ok(response);
    }
}