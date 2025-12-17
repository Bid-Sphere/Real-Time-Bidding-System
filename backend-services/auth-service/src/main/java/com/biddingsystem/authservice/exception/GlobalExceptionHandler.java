package com.biddingsystem.authservice.exception;

import com.biddingsystem.authservice.constant.ErrorCodeEnum;
import com.biddingsystem.authservice.model.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        ErrorResponse errorResponse = ErrorResponse.builder()
                .error("VALIDATION_ERROR")
                .message("Validation failed for one or more fields")
                .errorCode(ErrorCodeEnum.VALIDATION_ERROR.getErrorCode())
                .timestamp(java.time.LocalDateTime.now())
                .path(request.getDescription(false).replace("uri=", ""))
                .details(errors)
                .build();

        log.warn("Validation error: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, WebRequest request) {
        ErrorResponse errorResponse = ErrorResponse.fromErrorCode(
                ErrorCodeEnum.AUTHENTICATION_FAILED,
                request.getDescription(false).replace("uri=", "")
        );
        log.warn("Authentication failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        ErrorResponse errorResponse = ErrorResponse.fromErrorCode(
                ErrorCodeEnum.UNAUTHORIZED_ACCESS,
                request.getDescription(false).replace("uri=", "")
        );
        log.warn("Authentication exception: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        String errorName = determineErrorName(ex.getMessage());
        ErrorResponse errorResponse = ErrorResponse.customError(
                errorName,
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        log.warn("Illegal argument: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex, WebRequest request) {
        ErrorResponse errorResponse = ErrorResponse.fromErrorCode(
                ErrorCodeEnum.GENERIC_ERROR,
                request.getDescription(false).replace("uri=", "")
        );
        log.error("Runtime exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        ErrorResponse errorResponse = ErrorResponse.fromErrorCode(
                ErrorCodeEnum.INTERNAL_SERVER_ERROR,
                request.getDescription(false).replace("uri=", "")
        );
        log.error("Unexpected exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    private String determineErrorName(String message) {
        if (message == null) return "VALIDATION_ERROR";

        if (message.toLowerCase().contains("email") && message.toLowerCase().contains("exists")) {
            return "DUPLICATE_ENTRY";
        } else if (message.toLowerCase().contains("role")) {
            return "INVALID_ROLE";
        } else if (message.toLowerCase().contains("password")) {
            return "VALIDATION_ERROR";
        } else if (message.toLowerCase().contains("phone")) {
            return "INVALID_FORMAT";
        } else {
            return "VALIDATION_ERROR";
        }
    }
}