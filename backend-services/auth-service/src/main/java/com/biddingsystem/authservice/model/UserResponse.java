package com.biddingsystem.authservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String fullName; // Changed from firstName/lastName
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;

    // Common fields
    private String phone;
    private String location;

    // Role-specific profiles
    private Freelancer freelancerProfile;
    private Client clientProfile;
    private Organization organizationProfile;
}