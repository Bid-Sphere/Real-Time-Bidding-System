package com.biddingsystem.authservice.constant;

public enum UserRole
{
    CLIENT("CLIENT", "Client user who posts projects"),
    FREELANCER("FREELANCER", "Freelancer who bids on projects"),
    ORGANISATION("ORGANISATION", "Organization user"),
    ADMIN("ADMIN", "System administrator");

    private final String role;
    private final String description;

    UserRole(String role, String description) {
        this.role = role;
        this.description = description;
    }

    public String getRole() {
        return role;
    }

    public String getDescription() {
        return description;
    }

    public static boolean isValidRole(String role) {
        if (role == null) return false;
        for (UserRole userRole : values()) {
            if (userRole.getRole().equalsIgnoreCase(role)) {
                return true;
            }
        }
        return false;
    }

    public static UserRole fromString(String role) {
        if (role == null) return null;
        for (UserRole userRole : values()) {
            if (userRole.getRole().equalsIgnoreCase(role)) {
                return userRole;
            }
        }
        throw new IllegalArgumentException("Invalid role: " + role);
    }
}