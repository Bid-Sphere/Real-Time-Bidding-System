package com.biddingsystem.authservice.constant;

public enum ErrorCodeEnum
{

    // Generic Errors (10000-10099)
    GENERIC_ERROR("10000", "Unable to process request, please try again later"),
    INTERNAL_SERVER_ERROR("10001", "Internal server error occurred"),
    SERVICE_UNAVAILABLE("10002", "Service temporarily unavailable"),

    // Authentication Errors (10100-10199)
    AUTHENTICATION_FAILED("10100", "Invalid email or password"),
    TOKEN_EXPIRED("10101", "JWT token has expired. Please login again"),
    INVALID_TOKEN("10102", "Invalid or malformed JWT token"),
    UNAUTHORIZED_ACCESS("10103", "Unauthorized access to resource"),
    ACCESS_DENIED("10104", "Access denied for this resource"),
    ACCOUNT_INACTIVE("10105", "Account is inactive or disabled"),

    // Validation Errors (10200-10299)
    VALIDATION_ERROR("10200", "Validation failed for one or more fields"),
    INVALID_FORMAT("10201", "Invalid format for field"),
    INVALID_ROLE("10202", "Invalid user role specified"),
    DUPLICATE_ENTRY("10203", "Duplicate entry found"),
    REQUIRED_FIELD_MISSING("10204", "Required field is missing"),
    INVALID_LENGTH("10205", "Invalid field length"),

    // User Registration Errors (10300-10399)
    EMAIL_ALREADY_EXISTS("10300", "Email already registered in system"),
    INVALID_EMAIL_FORMAT("10301", "Email must be in valid format"),
    PASSWORD_TOO_SHORT("10302", "Password must be at least 6 characters"),
    INVALID_PHONE_FORMAT("10303", "Phone must be in valid format (+91XXXXXXXXXX)"),
    INVALID_NAME_FORMAT("10304", "Name contains invalid characters"),

    // Role-specific Validation Errors (10400-10499)
    FREELANCER_SKILLS_REQUIRED("10400", "Freelancer must have at least one skill"),
    FREELANCER_TITLE_REQUIRED("10401", "Professional title is required for freelancers"),
    FREELANCER_HOURLY_RATE_REQUIRED("10402", "Hourly rate is required for freelancers"),
    ORGANIZATION_COMPANY_REQUIRED("10403", "Company name is required for organizations"),
    ORGANIZATION_INDUSTRY_REQUIRED("10404", "Industry is required for organizations"),
    CLIENT_PHONE_REQUIRED("10405", "Phone number is required for clients"),

    // Database Errors (10500-10599)
    DATABASE_CONNECTION_ERROR("10500", "Database connection failed"),
    RECORD_NOT_FOUND("10501", "Requested record not found"),
    CONSTRAINT_VIOLATION("10502", "Database constraint violation"),

    // Request Errors (10600-10699)
    INVALID_REQUEST("10600", "Invalid request parameters"),
    METHOD_NOT_ALLOWED("10601", "HTTP method not allowed for this endpoint"),
    UNSUPPORTED_MEDIA_TYPE("10602", "Unsupported media type"),
    PARSE_ERROR("10603", "Invalid JSON format in request body"),

    // Business Logic Errors (10700-10799)
    INSUFFICIENT_PERMISSIONS("10700", "Insufficient permissions to perform action"),
    RATE_LIMIT_EXCEEDED("10701", "Rate limit exceeded, please try again later"),
    CONCURRENT_MODIFICATION("10702", "Resource was modified by another request");

    private final String errorCode;
    private final String errorMessage;

    ErrorCodeEnum(String errorCode, String errorMessage) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public static ErrorCodeEnum fromErrorCode(String errorCode) {
        for (ErrorCodeEnum error : values()) {
            if (error.getErrorCode().equals(errorCode)) {
                return error;
            }
        }
        return GENERIC_ERROR;
    }
}