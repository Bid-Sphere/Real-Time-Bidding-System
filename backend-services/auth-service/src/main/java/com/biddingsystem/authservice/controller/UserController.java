package com.biddingsystem.authservice.controller;

import com.biddingsystem.authservice.model.UserEntity;
import com.biddingsystem.authservice.model.UserResponse;
import com.biddingsystem.authservice.model.Organization;
import com.biddingsystem.authservice.model.Client;
import com.biddingsystem.authservice.repository.interfaces.UserRepository;
import com.biddingsystem.authservice.repository.interfaces.OrganizationRepository;
import com.biddingsystem.authservice.repository.interfaces.ClientRepository;
import com.biddingsystem.authservice.service.interfaces.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final ClientRepository clientRepository;
    private final AuthService authService;

    public UserController(UserRepository userRepository, 
                         OrganizationRepository organizationRepository,
                         ClientRepository clientRepository,
                         AuthService authService) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.clientRepository = clientRepository;
        this.authService = authService;
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

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> profileData, 
                                          Authentication authentication) {
        String email = authentication.getName();
        logger.info("Updating profile for user: {}", email);

        try {
            UserEntity user = authService.findUserByEmail(email);
            if (user == null) {
                logger.warn("User not found with email: {}", email);
                return ResponseEntity.notFound().build();
            }

            String role = user.getRole().toUpperCase();
            
            if ("ORGANISATION".equals(role)) {
                // Update organization profile
                Organization orgProfile = organizationRepository.findByUserId(user.getId());
                
                if (orgProfile == null) {
                    // Create new organization profile
                    orgProfile = new Organization();
                    orgProfile.setUserId(user.getId());
                }
                
                // Update fields from request
                if (profileData.containsKey("companyName")) {
                    orgProfile.setCompanyName((String) profileData.get("companyName"));
                }
                if (profileData.containsKey("industry")) {
                    orgProfile.setIndustry((String) profileData.get("industry"));
                }
                if (profileData.containsKey("companySize")) {
                    orgProfile.setCompanySize((String) profileData.get("companySize"));
                }
                if (profileData.containsKey("website")) {
                    orgProfile.setWebsite((String) profileData.get("website"));
                }
                if (profileData.containsKey("taxId")) {
                    orgProfile.setTaxId((String) profileData.get("taxId"));
                }
                if (profileData.containsKey("businessRegistrationNumber")) {
                    orgProfile.setBusinessRegistrationNumber((String) profileData.get("businessRegistrationNumber"));
                }
                if (profileData.containsKey("contactPerson")) {
                    orgProfile.setContactPerson((String) profileData.get("contactPerson"));
                }
                if (profileData.containsKey("contactPersonRole")) {
                    orgProfile.setContactPersonRole((String) profileData.get("contactPersonRole"));
                }
                
                // Save or update
                if (orgProfile.getId() == null) {
                    organizationRepository.saveOrganizationProfile(orgProfile);
                } else {
                    organizationRepository.updateOrganizationProfile(orgProfile);
                }
                
            } else if ("CLIENT".equals(role)) {
                // Update client profile
                Client clientProfile = clientRepository.findByUserId(user.getId());
                
                if (clientProfile == null) {
                    // Create new client profile
                    clientProfile = new Client();
                    clientProfile.setUserId(user.getId());
                }
                
                // Update fields from request
                if (profileData.containsKey("companyName")) {
                    clientProfile.setCompanyName((String) profileData.get("companyName"));
                }
                if (profileData.containsKey("industry")) {
                    clientProfile.setIndustry((String) profileData.get("industry"));
                }
                if (profileData.containsKey("companySize")) {
                    clientProfile.setCompanySize((String) profileData.get("companySize"));
                }
                if (profileData.containsKey("website")) {
                    clientProfile.setWebsite((String) profileData.get("website"));
                }
                if (profileData.containsKey("taxId")) {
                    clientProfile.setTaxId((String) profileData.get("taxId"));
                }
                if (profileData.containsKey("billingAddress")) {
                    clientProfile.setBillingAddress((String) profileData.get("billingAddress"));
                }
                
                // Save or update
                if (clientProfile.getId() == null) {
                    clientRepository.saveClientProfile(clientProfile);
                } else {
                    clientRepository.updateClientProfile(clientProfile);
                }
            }

            logger.info("Profile updated successfully for user: {}", email);
            return ResponseEntity.ok().body(Map.of("message", "Profile updated successfully"));

        } catch (Exception e) {
            logger.error("Failed to update profile for user {}: {}", email, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }
}