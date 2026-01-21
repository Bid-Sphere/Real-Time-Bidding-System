package com.biddingsystem.authservice.repository.interfaces;

import com.biddingsystem.authservice.model.UserEntity;

public interface UserRepository {
    int emailExists(String email);
    Long saveUser(UserEntity userEntity);
    UserEntity findByEmail(String email);
    UserEntity findById(Long userId);
    Long updateUserForInitialRegistration(UserEntity userEntity);
    void updateUser(UserEntity userEntity);
    void markEmailAsVerified(String email);
    void promoteToPhase2(String email);
    String formatSqlWithValues(String sql, Object... values);
}