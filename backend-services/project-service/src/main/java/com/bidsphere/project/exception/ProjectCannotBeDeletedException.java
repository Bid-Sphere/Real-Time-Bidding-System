package com.bidsphere.project.exception;




import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ProjectCannotBeDeletedException extends RuntimeException {
    public ProjectCannotBeDeletedException(String message) {
        super(message);
    }
}
