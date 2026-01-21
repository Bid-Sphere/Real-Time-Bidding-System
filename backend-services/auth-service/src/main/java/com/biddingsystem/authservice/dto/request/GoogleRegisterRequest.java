package com.biddingsystem.authservice.dto.request;

//import javax.validation.constraints.Email;
//import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleRegisterRequest
{
    //@NotBlank(message = "Email is required")
    //@Email(message = "Email should be valid")
    private String email;

    //@NotBlank(message = "Google ID is required")
    private String googleId;

    //@NotBlank(message = "Role is required")
    private String role; // CLIENT, ORGANISATION

    // Optional: You can add more fields from Google profile
    private String displayName;
    private String firstName;
    private String lastName;
    private String photoUrl;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}