package com.bidsphere.project.exception;



import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
public class InvalidFileTypeException extends RuntimeException {
    public InvalidFileTypeException(String fileType) {
        super("File type '" + fileType + "' is not supported");
    }
}