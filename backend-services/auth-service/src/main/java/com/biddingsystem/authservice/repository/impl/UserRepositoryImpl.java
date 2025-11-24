package com.biddingsystem.authservice.repository.impl;

import com.biddingsystem.authservice.model.UserEntity;
import com.biddingsystem.authservice.repository.interfaces.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Repository
public class UserRepositoryImpl implements UserRepository {
    private static final Logger log = LoggerFactory.getLogger(UserRepositoryImpl.class);

    private final JdbcTemplate jdbcTemplate;

    public UserRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int emailExists(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        log.info("Checking email: {}", email);
        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
            return count != null ? count : 0;
        } catch (Exception e) {
            log.error("Error checking email: {}", e.getMessage());
            return 0;
        }
    }

    @Override
    public Long saveUser(UserEntity userEntity) {
        String sql = "INSERT INTO users (email, password_hash, full_name, role, is_active, created_at, updated_at, phone, location) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id"; // Changed to full_name

        log.info("Saving user: {} with role: {}", userEntity.getEmail(), userEntity.getRole());

        try {
            Timestamp createdAt = Timestamp.valueOf(userEntity.getCreatedAt());
            Timestamp updatedAt = Timestamp.valueOf(userEntity.getUpdatedAt());

            Long userId = jdbcTemplate.queryForObject(sql, Long.class,
                    userEntity.getEmail(),
                    userEntity.getPasswordHash(),
                    userEntity.getFullName(), // Changed from firstName/lastName
                    userEntity.getRole(),
                    userEntity.getIsActive(),
                    createdAt,
                    updatedAt,
                    userEntity.getPhone(),
                    userEntity.getLocation()
            );

            log.info("User saved with ID: {}", userId);
            return userId;

        } catch (Exception e) {
            log.error("Failed to save user: {}", e.getMessage(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }

    @Override
    public UserEntity findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ? AND is_active = true";
        log.info("Finding user by email: {}", email);
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(UserEntity.class), email);
        } catch (Exception e) {
            log.info("User not found: {}", email);
            return null;
        }
    }

    @Override
    public UserEntity findById(Long userId) {
        String sql = "SELECT * FROM users WHERE id = ? AND is_active = true";
        log.info("Finding user by ID: {}", userId);
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(UserEntity.class), userId);
        } catch (Exception e) {
            log.info("User not found with ID: {}", userId);
            return null;
        }
    }

    @Override
    public String formatSqlWithValues(String sql, Object... values) {
        return sql;
    }
}