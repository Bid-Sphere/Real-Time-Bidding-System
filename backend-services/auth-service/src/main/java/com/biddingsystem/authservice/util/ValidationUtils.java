package com.biddingsystem.authservice.util;

import lombok.experimental.UtilityClass;
import lombok.extern.log4j.Log4j2;

@UtilityClass
@Log4j2
public class ValidationUtils {

    public boolean isValidEmail(String email) {
        if (email == null) return false;
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        boolean isValid = email.matches(emailRegex);
        log.debug("Email validation for {}: {}", email, isValid);
        return isValid;
    }

    public boolean isValidPassword(String password) {
        if (password == null || password.length() < 6) {
            log.debug("Password validation failed - too short");
            return false;
        }
        log.debug("Password validation passed");
        return true;
    }
}