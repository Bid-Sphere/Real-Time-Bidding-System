package com.biddingsystem.authservice.service.interfaces;

import com.biddingsystem.authservice.dto.request.GoogleRegisterRequest;
import com.biddingsystem.authservice.dto.request.Phase1RegisterRequest;
import com.biddingsystem.authservice.dto.request.Phase2RegisterRequest;
import com.biddingsystem.authservice.dto.response.RegistrationResponse;
import com.biddingsystem.authservice.model.LoginRequest;
import com.biddingsystem.authservice.model.LoginResponse;
import com.biddingsystem.authservice.model.RegisterRequest;
import com.biddingsystem.authservice.model.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    boolean checkPassword(String rawPassword, String encodedPassword);
    RegistrationResponse registerInitial(Phase1RegisterRequest request);
    UserResponse registerComplete(String email, Phase2RegisterRequest request);
    RegistrationResponse registerWithGoogle(GoogleRegisterRequest request);
    void loadUserProfile(com.biddingsystem.authservice.model.UserEntity user);
    com.biddingsystem.authservice.model.UserEntity findUserByEmail(String email);
    void markEmailAsVerified(String email);
    void promoteToPhase2(String email);
}