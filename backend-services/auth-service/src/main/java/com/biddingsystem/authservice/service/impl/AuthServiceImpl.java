package com.biddingsystem.authservice.service.impl;

import com.biddingsystem.authservice.model.*;
import com.biddingsystem.authservice.repository.interfaces.ClientRepository;
import com.biddingsystem.authservice.repository.interfaces.FreelancerRepository;
import com.biddingsystem.authservice.repository.interfaces.OrganizationRepository;
import com.biddingsystem.authservice.repository.interfaces.UserRepository;
import com.biddingsystem.authservice.service.interfaces.AuthService;
import com.biddingsystem.authservice.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthServiceImpl implements AuthService
{
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final FreelancerRepository freelancerRepository;
    private final ClientRepository clientRepository;
    private final OrganizationRepository organizationRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
                           FreelancerRepository freelancerRepository,
                           ClientRepository clientRepository,
                           OrganizationRepository organizationRepository,
                           JwtUtil jwtUtil,
                           BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.freelancerRepository = freelancerRepository;
        this.clientRepository = clientRepository;
        this.organizationRepository = organizationRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // Method for user registration
    @Override
    @Transactional
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
            throw new IllegalArgumentException("Invalid user role. Must be CLIENT, ORGANISATION, or FREELANCER");
        }

        // Validate role-specific required fields
        validateRoleSpecificFields(request);

        // Create and save base user
        UserEntity userEntity = buildUserEntityFromRequest(request);
        Long userId = userRepository.saveUser(userEntity);

        // Save role-specific profile
        saveRoleSpecificProfile(userId, request);

        // Fetch complete user with profile
        UserEntity savedUser = userRepository.findById(userId);
        if (savedUser == null) {
            throw new RuntimeException("Failed to retrieve saved user");
        }

        // Load role-specific profile into the user entity
        loadRoleSpecificProfile(savedUser);

        logger.info("User registered successfully: {} with role: {}", request.getEmail(), request.getRole());

        return buildUserResponse(savedUser);
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

        // Load role-specific profile for the logged-in user
        loadRoleSpecificProfile(foundUser);

        // Generate JWT token
        String token = jwtUtil.generateToken(foundUser.getEmail(), foundUser.getId().toString());

        logger.info("Login successful for user: {}", request.getEmail());

        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(foundUser.getId())
                .email(foundUser.getEmail())
                .fullName(foundUser.getFullName())
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
                upperRole.equals("ORGANISATION") ||
                upperRole.equals("FREELANCER") ||
                upperRole.equals("ADMIN");
    }

    private void validateRoleSpecificFields(RegisterRequest request) {
        String role = request.getRole().toUpperCase();

        switch (role) {
            case "FREELANCER":
                if (request.getFreelancerProfile() == null) {
                    throw new IllegalArgumentException("Freelancer profile is required");
                }
                Freelancer freelancerProfile = request.getFreelancerProfile();
                if (freelancerProfile.getProfessionalTitle() == null ||
                        freelancerProfile.getProfessionalTitle().trim().isEmpty()) {
                    throw new IllegalArgumentException("Professional title is required for freelancers");
                }
                if (freelancerProfile.getSkills() == null ||
                        freelancerProfile.getSkills().isEmpty()) {
                    throw new IllegalArgumentException("At least one skill is required for freelancers");
                }
                if (freelancerProfile.getHourlyRate() == null ||
                        freelancerProfile.getHourlyRate() <= 0) {
                    throw new IllegalArgumentException("Valid hourly rate is required for freelancers");
                }
                break;

            case "CLIENT":
                // For clients, phone is required
                if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
                    throw new IllegalArgumentException("Phone number is required for clients");
                }
                // Client profile is optional, but if provided, validate it
                if (request.getClientProfile() != null) {
                    Client clientProfile = request.getClientProfile();
                    // Add any client-specific validations here
                }
                break;

            case "ORGANISATION":
                if (request.getOrganizationProfile() == null) {
                    throw new IllegalArgumentException("Organization profile is required");
                }
                Organization orgProfile = request.getOrganizationProfile();
                if (orgProfile.getCompanyName() == null ||
                        orgProfile.getCompanyName().trim().isEmpty()) {
                    throw new IllegalArgumentException("Company name is required for organizations");
                }
                if (orgProfile.getIndustry() == null ||
                        orgProfile.getIndustry().trim().isEmpty()) {
                    throw new IllegalArgumentException("Industry is required for organizations");
                }
                break;

            default:
                throw new IllegalArgumentException("Unsupported role: " + role);
        }
    }

    private UserEntity buildUserEntityFromRequest(RegisterRequest request) {
        return UserEntity.builder()
                .email(request.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole().toUpperCase())
                .phone(request.getPhone())
                .location(request.getLocation())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private void saveRoleSpecificProfile(Long userId, RegisterRequest request) {
        String role = request.getRole().toUpperCase();

        switch (role) {
            case "FREELANCER":
                Freelancer freelancerProfile = request.getFreelancerProfile();
                freelancerProfile.setUserId(userId);
                freelancerRepository.saveFreelancerProfile(freelancerProfile);
                logger.info("Freelancer profile saved for user ID: {}", userId);
                break;

            case "CLIENT":
                Client clientProfile = request.getClientProfile();
                if (clientProfile != null) {
                    clientProfile.setUserId(userId);
                    clientRepository.saveClientProfile(clientProfile);
                    logger.info("Client profile saved for user ID: {}", userId);
                } else {
                    // Create a basic client profile if none provided
                    Client defaultClientProfile = Client.builder()
                            .userId(userId)
                            .build();
                    clientRepository.saveClientProfile(defaultClientProfile);
                    logger.info("Default client profile created for user ID: {}", userId);
                }
                break;

            case "ORGANISATION":
                Organization orgProfile = request.getOrganizationProfile();
                orgProfile.setUserId(userId);
                organizationRepository.saveOrganizationProfile(orgProfile);
                logger.info("Organization profile saved for user ID: {}", userId);
                break;

            default:
                logger.warn("No role-specific profile to save for role: {}", role);
                break;
        }
    }

    private void loadRoleSpecificProfile(UserEntity user) {
        String role = user.getRole().toUpperCase();
        Long userId = user.getId();

        switch (role) {
            case "FREELANCER":
                Freelancer freelancerProfile = freelancerRepository.findByUserId(userId);
                user.setFreelancerProfile(freelancerProfile);
                logger.debug("Loaded freelancer profile for user ID: {}", userId);
                break;

            case "CLIENT":
                Client clientProfile = clientRepository.findByUserId(userId);
                user.setClientProfile(clientProfile);
                logger.debug("Loaded client profile for user ID: {}", userId);
                break;

            case "ORGANISATION":
                Organization orgProfile = organizationRepository.findByUserId(userId);
                user.setOrganizationProfile(orgProfile);
                logger.debug("Loaded organization profile for user ID: {}", userId);
                break;

            default:
                logger.debug("No role-specific profile to load for role: {}", role);
                break;
        }
    }

    private UserResponse buildUserResponse(UserEntity user) {
        UserResponse.UserResponseBuilder responseBuilder = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .phone(user.getPhone())
                .location(user.getLocation());

        // Add role-specific profiles to response
        String role = user.getRole().toUpperCase();
        switch (role) {
            case "FREELANCER":
                responseBuilder.freelancerProfile(user.getFreelancerProfile());
                break;
            case "CLIENT":
                responseBuilder.clientProfile(user.getClientProfile());
                break;
            case "ORGANISATION":
                responseBuilder.organizationProfile(user.getOrganizationProfile());
                break;
        }

        return responseBuilder.build();
    }

    // Helper method to get user profile (for profile updates)
    public UserResponse getUserProfile(Long userId) {
        logger.info("Fetching user profile for ID: {}", userId);

        UserEntity user = userRepository.findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        // Load role-specific profile
        loadRoleSpecificProfile(user);

        return buildUserResponse(user);
    }

    // Helper method to update user profile
    @Transactional
    public UserResponse updateUserProfile(Long userId, RegisterRequest updateRequest) {
        logger.info("Updating user profile for ID: {}", userId);

        UserEntity existingUser = userRepository.findById(userId);
        if (existingUser == null) {
            throw new IllegalArgumentException("User not found");
        }

        // Update common fields
        if (updateRequest.getFullName() != null) {
            existingUser.setFullName(updateRequest.getFullName());
        }
        if (updateRequest.getPhone() != null) {
            existingUser.setPhone(updateRequest.getPhone());
        }
        if (updateRequest.getLocation() != null) {
            existingUser.setLocation(updateRequest.getLocation());
        }
        existingUser.setUpdatedAt(LocalDateTime.now());

        // TODO: Add logic to update the user in repository
        // userRepository.updateUser(existingUser);

        // Update role-specific profile
        updateRoleSpecificProfile(userId, updateRequest);

        // Reload the complete user
        UserEntity updatedUser = userRepository.findById(userId);
        loadRoleSpecificProfile(updatedUser);

        logger.info("User profile updated successfully for ID: {}", userId);
        return buildUserResponse(updatedUser);
    }

    private void updateRoleSpecificProfile(Long userId, RegisterRequest updateRequest) {
        String role = updateRequest.getRole().toUpperCase();

        switch (role) {
            case "FREELANCER":
                if (updateRequest.getFreelancerProfile() != null) {
                    Freelancer freelancerProfile = updateRequest.getFreelancerProfile();
                    freelancerProfile.setUserId(userId);
                    freelancerRepository.updateFreelancerProfile(freelancerProfile);
                }
                break;

            case "CLIENT":
                if (updateRequest.getClientProfile() != null) {
                    Client clientProfile = updateRequest.getClientProfile();
                    clientProfile.setUserId(userId);
                    clientRepository.updateClientProfile(clientProfile);
                }
                break;

            case "ORGANISATION":
                if (updateRequest.getOrganizationProfile() != null) {
                    Organization orgProfile = updateRequest.getOrganizationProfile();
                    orgProfile.setUserId(userId);
                    organizationRepository.updateOrganizationProfile(orgProfile);
                }
                break;
        }
    }
}