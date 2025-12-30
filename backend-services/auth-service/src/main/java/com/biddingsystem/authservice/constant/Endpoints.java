package com.biddingsystem.authservice.constant;

public class Endpoints
{
    // Base API paths
    public static final String API_BASE = "/api";
    public static final String AUTH_BASE = API_BASE + "/auth";
    public static final String USER_BASE = API_BASE + "/users";
    public static final String ADMIN_BASE = API_BASE + "/admin";

    // Authentication endpoints
    public static final String REGISTER = "/register";

    // Registration endpoints
    public static final String REGISTER_INITIAL = "/register-initial";
    public static final String REGISTER_COMPLETE = "/register-complete";


    public static final String LOGIN = "/login";
    public static final String LOGOUT = "/logout";
    public static final String REFRESH_TOKEN = "/refresh-token";
    public static final String FORGOT_PASSWORD = "/forgot-password";
    public static final String RESET_PASSWORD = "/reset-password";

    // Health and test endpoints
    public static final String HEALTH = "/health";
    public static final String DB_HEALTH = "/db-health";
    public static final String CORS_TEST = "/cors-test";

    // User management endpoints
    public static final String PROFILE = "/profile";
    public static final String USER_BY_ID = "/{id}";

    // Role-specific endpoints
    public static final String FREELANCER_BASE = API_BASE + "/freelancer";
    public static final String CLIENT_BASE = API_BASE + "/client";
    public static final String ORGANIZATION_BASE = API_BASE + "/organisation";

    // Full endpoint paths
    public static final String REGISTER_ENDPOINT = AUTH_BASE + REGISTER;
    public static final String REGISTER_INITIAL_ENDPOINT = AUTH_BASE + REGISTER_INITIAL;
    public static final String REGISTER_COMPLETE_ENDPOINT = AUTH_BASE + REGISTER_COMPLETE;
    public static final String LOGIN_ENDPOINT = AUTH_BASE + LOGIN;
    public static final String PROFILE_ENDPOINT = USER_BASE + PROFILE;
    public static final String HEALTH_ENDPOINT = AUTH_BASE + HEALTH;

    private Endpoints() {
        // Prevent instantiation
    }
}
