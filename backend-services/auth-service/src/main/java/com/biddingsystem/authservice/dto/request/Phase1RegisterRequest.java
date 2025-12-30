package com.biddingsystem.authservice.dto.request;

//import javax.validation.constraints.Email;
//import javax.validation.constraints.NotBlank;
//import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class Phase1RegisterRequest {
    //@NotBlank(message = "Email is required")
    //@Email(message = "Email should be valid")
    private String email;

    //@NotBlank(message = "Password is required")
    //@Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    //@NotBlank(message = "Role is required")
    private String role; // CLIENT, ORGANISATION, FREELANCER

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}