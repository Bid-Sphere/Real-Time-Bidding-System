package com.biddingsystem.authservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//import javax.validation.constraints.Email;
//import javax.validation.constraints.NotBlank;
//import javax.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    //@NotBlank(message = "Email is required")
    //@Email(message = "Email should be valid")
    private String email;

    //@NotBlank(message = "Password is required")
    //@Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    //@NotBlank(message = "Full name is required") // Changed from firstName/lastName
    private String fullName;

    //@NotBlank(message = "Role is required")
    private String role; // CLIENT, ORGANISATION, FREELANCER

    // Common optional fields
    private String phone;
    private String location;

    // Role-specific data
    private Freelancer freelancerProfile;
    private Client clientProfile;
    private Organization organizationProfile;
}