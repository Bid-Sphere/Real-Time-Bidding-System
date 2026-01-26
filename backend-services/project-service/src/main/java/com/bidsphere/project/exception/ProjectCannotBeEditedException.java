package com.bidsphere.project.exception;




import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ProjectCannotBeEditedException extends RuntimeException {
    public ProjectCannotBeEditedException(String message) {
        super(message);
    }
}