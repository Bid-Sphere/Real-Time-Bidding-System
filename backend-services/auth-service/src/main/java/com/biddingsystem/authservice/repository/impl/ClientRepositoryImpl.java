package com.biddingsystem.authservice.repository.impl;

import com.biddingsystem.authservice.model.Client;
import com.biddingsystem.authservice.repository.interfaces.ClientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class ClientRepositoryImpl implements ClientRepository {
    private static final Logger log = LoggerFactory.getLogger(ClientRepositoryImpl.class);

    private final JdbcTemplate jdbcTemplate;

    public ClientRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Client> clientProfileRowMapper = new RowMapper<Client>() {
        @Override
        public Client mapRow(ResultSet rs, int rowNum) throws SQLException {
            return Client.builder()
                    .id(rs.getLong("id"))
                    .userId(rs.getLong("user_id"))
                    .companyName(rs.getString("company_name"))
                    .industry(rs.getString("industry"))
                    .website(rs.getString("website"))
                    .billingAddress(rs.getString("billing_address"))
                    .taxId(rs.getString("tax_id"))
                    .build();
        }
    };

    @Override
    public Long saveClientProfile(Client profile) {
        String sql = "INSERT INTO client (user_id, company_name, industry, website, billing_address, tax_id) " +
                "VALUES (?, ?, ?, ?, ?, ?) RETURNING id";

        log.info("Saving client profile for user ID: {}", profile.getUserId());

        try {
            Long profileId = jdbcTemplate.queryForObject(sql, Long.class,
                    profile.getUserId(),
                    profile.getCompanyName(),
                    profile.getIndustry(),
                    profile.getWebsite(),
                    profile.getBillingAddress(),
                    profile.getTaxId()
            );

            log.info("Client profile saved with ID: {}", profileId);
            return profileId;

        } catch (Exception e) {
            log.error("Failed to save client profile for user {}: {}", profile.getUserId(), e.getMessage(), e);
            throw new RuntimeException("Failed to save client profile: " + e.getMessage(), e);
        }
    }

    @Override
    public Client findByUserId(Long userId) {
        String sql = "SELECT * FROM client WHERE user_id = ?";

        log.info("Finding client profile for user ID: {}", userId);

        try {
            return jdbcTemplate.queryForObject(sql, clientProfileRowMapper, userId);
        } catch (Exception e) {
            log.info("Client profile not found for user ID: {}", userId);
            return null;
        }
    }

    @Override
    public void updateClientProfile(Client profile) {
        String sql = "UPDATE client SET company_name = ?, industry = ?, " +
                "website = ?, billing_address = ?, tax_id = ? " +
                "WHERE user_id = ?";

        log.info("Updating client profile for user ID: {}", profile.getUserId());

        try {
            int rowsUpdated = jdbcTemplate.update(sql,
                    profile.getCompanyName(),
                    profile.getIndustry(),
                    profile.getWebsite(),
                    profile.getBillingAddress(),
                    profile.getTaxId(),
                    profile.getUserId()
            );

            if (rowsUpdated == 0) {
                log.warn("No client profile found to update for user ID: {}", profile.getUserId());
            } else {
                log.info("Client profile updated successfully for user ID: {}", profile.getUserId());
            }

        } catch (Exception e) {
            log.error("Failed to update client profile for user {}: {}", profile.getUserId(), e.getMessage(), e);
            throw new RuntimeException("Failed to update client profile: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteByUserId(Long userId) {
        String sql = "DELETE FROM client WHERE user_id = ?";

        log.info("Deleting client profile for user ID: {}", userId);

        try {
            int rowsDeleted = jdbcTemplate.update(sql, userId);
            log.info("Deleted {} client profile(s) for user ID: {}", rowsDeleted, userId);
        } catch (Exception e) {
            log.error("Failed to delete client profile for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete client profile: " + e.getMessage(), e);
        }
    }
}