package com.biddingsystem.authservice.dto.request;

//import javax.validation.constraints.NotBlank;
import com.biddingsystem.authservice.model.Client;
import com.biddingsystem.authservice.model.Organization;
import lombok.Data;

@Data
public class Phase2RegisterRequest
{
    //@NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;
    private String location;

    // Role-specific data
    private Client clientProfile;
    private Organization organizationProfile;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Client getClientProfile() {
        return clientProfile;
    }

    public void setClientProfile(Client clientProfile) {
        this.clientProfile = clientProfile;
    }

    public Organization getOrganizationProfile() {
        return organizationProfile;
    }

    public void setOrganizationProfile(Organization organizationProfile) {
        this.organizationProfile = organizationProfile;
    }
}