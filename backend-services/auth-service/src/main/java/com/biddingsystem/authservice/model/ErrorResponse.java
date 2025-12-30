package com.biddingsystem.authservice.model;

import com.biddingsystem.authservice.constant.ErrorCodeEnum;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse
{
    private String error;
    private String message;
    private String errorCode;
    private LocalDateTime timestamp;
    private String path;
    private Object details;

    public static ErrorResponse fromErrorCode(ErrorCodeEnum errorCode, String path) {
        return ErrorResponse.builder()
                .error(errorCode.name())
                .message(errorCode.getErrorMessage())
                .errorCode(errorCode.getErrorCode())
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }

    public static ErrorResponse fromErrorCodeWithDetails(ErrorCodeEnum errorCode, String path, Object details) {
        return ErrorResponse.builder()
                .error(errorCode.name())
                .message(errorCode.getErrorMessage())
                .errorCode(errorCode.getErrorCode())
                .timestamp(LocalDateTime.now())
                .path(path)
                .details(details)
                .build();
    }

    public static ErrorResponse customError(String error, String message, String path) {
        return ErrorResponse.builder()
                .error(error)
                .message(message)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }
}