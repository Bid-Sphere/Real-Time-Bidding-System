package com.biddingsystem.authservice.controller;

import com.biddingsystem.authservice.constant.Endpoints;
import com.biddingsystem.authservice.constant.ErrorCodeEnum;
import com.biddingsystem.authservice.dto.request.GoogleRegisterRequest;
import com.biddingsystem.authservice.dto.request.Phase1RegisterRequest;
import com.biddingsystem.authservice.dto.request.Phase2RegisterRequest;
import com.biddingsystem.authservice.dto.response.RegistrationResponse;
import com.biddingsystem.authservice.model.*;
import com.biddingsystem.authservice.service.impl.AuthServiceImpl;
import com.biddingsystem.authservice.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(Endpoints.AUTH_BASE)
//@RequiredArgsConstructor
@Log4j2
public class AuthController {

    private final AuthServiceImpl authService;
    private final JdbcTemplate jdbcTemplate;
    private final JwtUtil jwtUtil;

    public AuthController(AuthServiceImpl authService, JdbcTemplate jdbcTemplate, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jdbcTemplate = jdbcTemplate;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(Endpoints.REGISTER)
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request,
                                      HttpServletRequest servletRequest) {
        log.info("Received registration request for: {}", request.getEmail());

        try {
            UserResponse response = authService.register(request);
            log.info("Registration completed successfully for: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            // Let GlobalExceptionHandler handle it with proper error response
            throw e;

        } catch (Exception e) {
            log.error("Registration failed for {}: {}", request.getEmail(), e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("REGISTRATION_FAILED")
                    .message("Registration failed due to server error")
                    .errorCode(ErrorCodeEnum.GENERIC_ERROR.getErrorCode())
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @PostMapping(Endpoints.LOGIN)
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request,
                                   HttpServletRequest servletRequest) {
        log.info("Received login request for: {}", request.getEmail());

        try {
            LoginResponse response = authService.login(request);
            log.info("Login successful for: {}", request.getEmail());
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // Authentication failures will be handled by GlobalExceptionHandler
            throw e;

        } catch (Exception e) {
            log.error("Login failed for {}: {}", request.getEmail(), e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("LOGIN_FAILED")
                    .message("Login failed due to server error")
                    .errorCode(ErrorCodeEnum.GENERIC_ERROR.getErrorCode())
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Phase 1: Initial registration (email + password + role)
    @PostMapping(Endpoints.REGISTER_INITIAL)
    public ResponseEntity<?> registerInitial(@Valid @RequestBody Phase1RegisterRequest request,
                                             HttpServletRequest servletRequest) {
        log.info("Received initial registration request for: {}", request.getEmail());

        try {
            RegistrationResponse response = authService.registerInitial(request);
            log.info("Initial registration completed successfully for: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Initial registration failed for {}: {}", request.getEmail(), e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("INITIAL_REGISTRATION_FAILED")
                    .message("Initial registration failed due to server error")
                    .errorCode(ErrorCodeEnum.GENERIC_ERROR.getErrorCode())
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Phase 2: Complete registration with profile details
    @PostMapping(Endpoints.REGISTER_COMPLETE)
    public ResponseEntity<?> registerComplete(@Valid @RequestBody Phase2RegisterRequest request,
                                              @RequestHeader("Authorization") String authHeader,
                                              HttpServletRequest servletRequest) {
        try {
            // Extract token and validate
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);

            if (email == null || !jwtUtil.validateToken(token, email)) {
                throw new IllegalArgumentException("Invalid or expired token");
            }

            log.info("Received complete registration request for: {}", email);
            UserResponse response = authService.registerComplete(email, request);

            log.info("Registration completed successfully for: {}", email);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Complete registration failed: {}", e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("COMPLETE_REGISTRATION_FAILED")
                    .message("Failed to complete registration")
                    .errorCode(ErrorCodeEnum.GENERIC_ERROR.getErrorCode())
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Google Registration Endpoint (Phase 1 only)
    @PostMapping("/register/google")
    public ResponseEntity<?> registerWithGoogle(@Valid @RequestBody GoogleRegisterRequest request,
                                                HttpServletRequest servletRequest) {
        log.info("Received Google registration request for: {}", request.getEmail());

        try {
            RegistrationResponse response = authService.registerWithGoogle(request);
            log.info("Google registration completed successfully for: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Google registration failed for {}: {}", request.getEmail(), e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("GOOGLE_REGISTRATION_FAILED")
                    .message("Google registration failed due to server error")
                    .errorCode(ErrorCodeEnum.GENERIC_ERROR.getErrorCode())
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping(Endpoints.HEALTH)
    public ResponseEntity<String> health() {
        log.debug("Health check endpoint called");
        return ResponseEntity.ok("Auth Service is healthy");
    }

    @GetMapping(Endpoints.DB_HEALTH)
    public ResponseEntity<?> databaseHealth(HttpServletRequest servletRequest) {
        log.info("Checking database health...");

        try {
            // Test basic connection and query
            String version = jdbcTemplate.queryForObject("SELECT version()", String.class);
            String currentTime = jdbcTemplate.queryForObject("SELECT NOW()", String.class);
            Integer userCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);

            Map<String, Object> healthStatus = new HashMap<>();
            healthStatus.put("status", "HEALTHY");
            healthStatus.put("database", "PostgreSQL");
            healthStatus.put("version", version);
            healthStatus.put("current_time", currentTime);
            healthStatus.put("user_count", userCount != null ? userCount : 0);
            healthStatus.put("timestamp", LocalDateTime.now());

            log.info("Database health check: HEALTHY");
            return ResponseEntity.ok(healthStatus);

        } catch (Exception e) {
            log.error("Database health check: UNHEALTHY - {}", e.getMessage());

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("DATABASE_CONNECTION_ERROR")
                    .message("Database connection failed")
                    .errorCode(ErrorCodeEnum.DATABASE_CONNECTION_ERROR.getErrorCode())
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(errorResponse);
        }
    }

    @GetMapping(Endpoints.CORS_TEST)
    public ResponseEntity<Map<String, Object>> corsTest(
            @RequestHeader(value = "Origin", required = false) String origin,
            HttpServletRequest request) {
        log.info("CORS test endpoint called from origin: {}", origin);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "CORS is properly configured!");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("frontendUrl", "https://spherebid.vercel.app");
        response.put("requestOrigin", origin);
        response.put("requestPath", request.getRequestURI());
        response.put("allowedMethods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        response.put("allowedHeaders", "Authorization, Content-Type, userId");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/headers-test")
    public ResponseEntity<Map<String, Object>> headersTest(@RequestHeader Map<String, String> headers) {
        log.info("Headers test endpoint called");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("headers", headers);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/db-config")
    public ResponseEntity<Map<String, String>> showDbConfig() {
        Map<String, String> config = new HashMap<>();

        // Log environment variables (mask passwords)
        String url = System.getenv("SPRING_DATASOURCE_URL");
        String username = System.getenv("SPRING_DATASOURCE_USERNAME");
        String password = System.getenv("SPRING_DATASOURCE_PASSWORD");

        config.put("url", url != null ? url : "Not set");
        config.put("username", username != null ? username : "Not set");
        config.put("password_length", password != null ? String.valueOf(password.length()) : "0");
        config.put("driver", System.getenv("SPRING_DATASOURCE_DRIVER_CLASS_NAME") != null ?
                System.getenv("SPRING_DATASOURCE_DRIVER_CLASS_NAME") : "org.postgresql.Driver");

        log.debug("Database configuration: URL={}, Username={}",
                url != null ? maskUrl(url) : "Not set",
                username != null ? username : "Not set");

        return ResponseEntity.ok(config);
    }

    private String maskUrl(String url) {
        // Mask password in URL for logging
        if (url == null) return null;
        if (url.contains("@")) {
            return url.substring(0, url.indexOf("//") + 2) + "***@***";
        }
        return url;
    }

    // Additional endpoints for future use

    @PostMapping(Endpoints.LOGOUT)
    public ResponseEntity<?> logout(HttpServletRequest servletRequest) {
        log.info("Logout request received");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Logout successful");
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @PostMapping(Endpoints.FORGOT_PASSWORD)
    public ResponseEntity<?> forgotPassword(@RequestParam String email,
                                            HttpServletRequest servletRequest) {
        log.info("Forgot password request for: {}", email);

        try {
            // TODO: Implement forgot password logic
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Password reset instructions sent to email");
            response.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Forgot password failed for {}: {}", email, e.getMessage());

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("FORGOT_PASSWORD_FAILED")
                    .message("Failed to process forgot password request")
                    .errorCode(ErrorCodeEnum.GENERIC_ERROR.getErrorCode())
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> serviceStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "Authentication Service");
        status.put("status", "RUNNING");
        status.put("version", "1.0.0");
        status.put("timestamp", LocalDateTime.now());
        status.put("endpoints", new String[]{
                Endpoints.REGISTER_ENDPOINT,
                Endpoints.LOGIN_ENDPOINT,
                Endpoints.HEALTH_ENDPOINT,
                Endpoints.PROFILE_ENDPOINT
        });

        return ResponseEntity.ok(status);
    }
}