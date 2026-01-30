package com.bidsphere.auctionservice.constant;

public class SecurityConstants {
    private SecurityConstants() {}

    // JWT Token constants
    public static final String AUTH_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";

    // JWT Claim constants
    public static final String USER_ID_CLAIM = "userId";
    public static final String ORG_ID_CLAIM = "organizationId";
    public static final String ORG_NAME_CLAIM = "organizationName";
    public static final String ROLE_CLAIM = "role";

    // Custom Headers for microservice communication
    public static final String USER_ID_HEADER = "X-User-Id";
    public static final String USER_NAME_HEADER = "X-User-Name";
    public static final String USER_EMAIL_HEADER = "X-User-Email";
    public static final String ORG_ID_HEADER = "X-Organization-Id";
    public static final String ORG_NAME_HEADER = "X-Organization-Name";
    public static final String ROLE_HEADER = "X-User-Role";

    // Security roles
    public static final String ROLE_CLIENT = "CLIENT";
    public static final String ROLE_ORGANIZATION = "ORGANISATION";
    public static final String ROLE_FREELANCER = "FREELANCER";
    public static final String ROLE_ADMIN = "ADMIN";
}