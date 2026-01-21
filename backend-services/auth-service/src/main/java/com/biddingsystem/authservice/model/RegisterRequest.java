package com.biddingsystem.authservice.model;

import lombok.Builder;
import lombok.Data;

//import javax.validation.constraints.Email;
//import javax.validation.constraints.NotBlank;
//import javax.validation.constraints.Size;

@Data
@Builder
//@NoArgsConstructor
//@AllArgsConstructor
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
    private String role; // CLIENT, ORGANISATION

    // Common optional fields
    private String phone;
    private String location;

    // Role-specific data
    private Client clientProfile;
    private Organization organizationProfile;

    public RegisterRequest() {
    }

    public RegisterRequest(String email, String password, String fullName, String role, String phone, String location, Client clientProfile, Organization organizationProfile) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.phone = phone;
        this.location = location;
        this.clientProfile = clientProfile;
        this.organizationProfile = organizationProfile;
    }
}