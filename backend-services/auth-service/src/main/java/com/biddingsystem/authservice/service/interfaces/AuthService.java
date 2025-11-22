package com.biddingsystem.authservice.service.interfaces;

import com.biddingsystem.authservice.model.LoginRequest;
import com.biddingsystem.authservice.model.LoginResponse;
import com.biddingsystem.authservice.model.RegisterRequest;
import com.biddingsystem.authservice.model.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    boolean checkPassword(String rawPassword, String encodedPassword);
}