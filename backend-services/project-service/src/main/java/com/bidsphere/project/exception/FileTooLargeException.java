package com.bidsphere.project.exception;



import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
public class FileTooLargeException extends RuntimeException {
    public FileTooLargeException(Long size, Long maxSize) {
        super("File size " + size + " bytes exceeds maximum allowed size of " + maxSize + " bytes");
    }
}
