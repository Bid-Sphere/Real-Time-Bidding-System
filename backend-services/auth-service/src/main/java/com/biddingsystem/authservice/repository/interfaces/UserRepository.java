package com.biddingsystem.authservice.repository.interfaces;

import com.biddingsystem.authservice.model.UserEntity;

public interface UserRepository {
    int emailExists(String email);
    Long saveUser(UserEntity userEntity);
    UserEntity findByEmail(String email);
    UserEntity findById(Long userId);
    String formatSqlWithValues(String sql, Object... values);
}