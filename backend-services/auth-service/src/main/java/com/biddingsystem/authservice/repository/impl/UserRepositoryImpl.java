package com.biddingsystem.authservice.repository.impl;

import com.biddingsystem.authservice.model.UserEntity;
import com.biddingsystem.authservice.repository.interfaces.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

@Repository
public class UserRepositoryImpl implements UserRepository {
    private static final Logger log = LoggerFactory.getLogger(UserRepositoryImpl.class);

    private final JdbcTemplate jdbcTemplate;

    public UserRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<UserEntity> userRowMapper = new RowMapper<UserEntity>() {
        @Override
        public UserEntity mapRow(ResultSet rs, int rowNum) throws SQLException {
            return UserEntity.builder()
                    .id(rs.getLong("id"))
                    .email(rs.getString("email"))
                    .passwordHash(rs.getString("password_hash"))
                    .fullName(rs.getString("full_name"))
                    .role(rs.getString("role"))
                    .isActive(rs.getBoolean("is_active"))
                    .registrationStatus(rs.getString("registration_status"))
                    .registrationStep(rs.getInt("registration_step"))
                    .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                    .updatedAt(rs.getTimestamp("updated_at").toLocalDateTime())
                    .phone(rs.getString("phone"))
                    .location(rs.getString("location"))
                    .build();
        }
    };

    @Override
    public UserEntity findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        log.info("Finding user by email: {}", email);

        try {
            return jdbcTemplate.queryForObject(sql, userRowMapper, email);
        } catch (EmptyResultDataAccessException e) {
            log.info("No user found with email: {}", email);
            return null;
        } catch (Exception e) {
            log.error("Error finding user by email: {}", e.getMessage());
            throw new RuntimeException("Error finding user: " + e.getMessage(), e);
        }
    }

    @Override
    public Long updateUserForInitialRegistration(UserEntity userEntity) {
        String sql = "UPDATE users SET " +
                "password_hash = ?, " +
                "role = ?, " +
                "registration_status = ?, " +
                "registration_step = ?, " +
                "updated_at = ? " +
                "WHERE email = ? RETURNING id";

        log.info("Updating user for initial registration: {}", userEntity.getEmail());

        try {
            Timestamp updatedAt = Timestamp.valueOf(userEntity.getUpdatedAt());

            return jdbcTemplate.queryForObject(sql, Long.class,
                    userEntity.getPasswordHash(),
                    userEntity.getRole(),
                    userEntity.getRegistrationStatus(),
                    userEntity.getRegistrationStep(),
                    updatedAt,
                    userEntity.getEmail()
            );
        } catch (Exception e) {
            log.error("Failed to update user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update user: " + e.getMessage(), e);
        }
    }

    @Override
    public void updateUser(UserEntity userEntity) {
        String sql = "UPDATE users SET " +
                "full_name = ?, " +
                "phone = ?, " +
                "location = ?, " +
                "registration_status = ?, " +
                "registration_step = ?, " +
                "updated_at = ? " +
                "WHERE id = ?";

        log.info("Updating user profile for user ID: {}", userEntity.getId());

        try {
            Timestamp updatedAt = Timestamp.valueOf(userEntity.getUpdatedAt());

            jdbcTemplate.update(sql,
                    userEntity.getFullName(),
                    userEntity.getPhone(),
                    userEntity.getLocation(),
                    userEntity.getRegistrationStatus(),
                    userEntity.getRegistrationStep(),
                    updatedAt,
                    userEntity.getId()
            );
        } catch (Exception e) {
            log.error("Failed to update user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update user: " + e.getMessage(), e);
        }
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
        String sql = "INSERT INTO users (email, password_hash, full_name, role, is_active, " +
                "registration_status, registration_step, created_at, updated_at, phone, location) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";

        log.info("Saving user: {} with role: {}", userEntity.getEmail(), userEntity.getRole());

        try {
            Timestamp createdAt = Timestamp.valueOf(userEntity.getCreatedAt());
            Timestamp updatedAt = Timestamp.valueOf(userEntity.getUpdatedAt());

            Long userId = jdbcTemplate.queryForObject(sql, Long.class,
                    userEntity.getEmail(),
                    userEntity.getPasswordHash(),
                    userEntity.getFullName(), // Can be null
                    userEntity.getRole(),
                    userEntity.getIsActive(),
                    userEntity.getRegistrationStatus(), // Add this
                    userEntity.getRegistrationStep(),   // Add this
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



//    @Override
//    public Long saveUser(UserEntity userEntity) {
//        String sql = "INSERT INTO users (email, password_hash, full_name, role, is_active, created_at, updated_at, phone, location) " +
//                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id"; // Changed to full_name
//
//        log.info("Saving user: {} with role: {}", userEntity.getEmail(), userEntity.getRole());
//
//        try {
//            Timestamp createdAt = Timestamp.valueOf(userEntity.getCreatedAt());
//            Timestamp updatedAt = Timestamp.valueOf(userEntity.getUpdatedAt());
//
//            Long userId = jdbcTemplate.queryForObject(sql, Long.class,
//                    userEntity.getEmail(),
//                    userEntity.getPasswordHash(),
//                    userEntity.getFullName(), // Changed from firstName/lastName
//                    userEntity.getRole(),
//                    userEntity.getIsActive(),
//                    createdAt,
//                    updatedAt,
//                    userEntity.getPhone(),
//                    userEntity.getLocation()
//            );
//
//            log.info("User saved with ID: {}", userId);
//            return userId;
//
//        } catch (Exception e) {
//            log.error("Failed to save user: {}", e.getMessage(), e);
//            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
//        }
//    }

//    @Override
//    public UserEntity findByEmail(String email) {
//        String sql = "SELECT * FROM users WHERE email = ? AND is_active = true";
//        log.info("Finding user by email: {}", email);
//        try {
//            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(UserEntity.class), email);
//        } catch (Exception e) {
//            log.info("User not found: {}", email);
//            return null;
//        }
//    }

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