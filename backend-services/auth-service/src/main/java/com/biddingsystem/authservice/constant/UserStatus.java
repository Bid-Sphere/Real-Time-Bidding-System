package com.biddingsystem.authservice.constant;

public enum UserStatus {
    ACTIVE("ACTIVE", "User account is active"),
    INACTIVE("INACTIVE", "User account is inactive"),
    SUSPENDED("SUSPENDED", "User account is suspended"),
    PENDING("PENDING", "User account is pending approval"),
    DELETED("DELETED", "User account is deleted");

    private final String status;
    private final String description;

    UserStatus(String status, String description) {
        this.status = status;
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public String getDescription() {
        return description;
    }
}