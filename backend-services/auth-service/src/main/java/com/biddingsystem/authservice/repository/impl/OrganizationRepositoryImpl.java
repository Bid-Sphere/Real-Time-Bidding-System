package com.biddingsystem.authservice.repository.impl;

import com.biddingsystem.authservice.model.Organization;
import com.biddingsystem.authservice.repository.interfaces.OrganizationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class OrganizationRepositoryImpl implements OrganizationRepository {
    private static final Logger log = LoggerFactory.getLogger(OrganizationRepositoryImpl.class);

    private final JdbcTemplate jdbcTemplate;

    public OrganizationRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Organization> organizationProfileRowMapper = new RowMapper<Organization>() {
        @Override
        public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
            return Organization.builder()
                    .id(rs.getLong("id"))
                    .userId(rs.getLong("user_id"))
                    .companyName(rs.getString("company_name"))
                    .industry(rs.getString("industry"))
                    .companySize(rs.getString("company_size"))
                    .website(rs.getString("website"))
                    .taxId(rs.getString("tax_id"))
                    .businessRegistrationNumber(rs.getString("business_registration_number"))
                    .contactPerson(rs.getString("contact_person"))
                    .contactPersonRole(rs.getString("contact_person_role"))
                    .build();
        }
    };

    @Override
    public Long saveOrganizationProfile(Organization profile) {
        String sql = "INSERT INTO organization (user_id, company_name, industry, company_size, website, " +
                "tax_id, business_registration_number, contact_person, contact_person_role) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";

        log.info("Saving organization profile for user ID: {}", profile.getUserId());

        try {
            Long profileId = jdbcTemplate.queryForObject(sql, Long.class,
                    profile.getUserId(),
                    profile.getCompanyName(),
                    profile.getIndustry(),
                    profile.getCompanySize(),
                    profile.getWebsite(),
                    profile.getTaxId(),
                    profile.getBusinessRegistrationNumber(),
                    profile.getContactPerson(),
                    profile.getContactPersonRole()
            );

            log.info("Organization profile saved with ID: {}", profileId);
            return profileId;

        } catch (Exception e) {
            log.error("Failed to save organization profile for user {}: {}", profile.getUserId(), e.getMessage(), e);
            throw new RuntimeException("Failed to save organization profile: " + e.getMessage(), e);
        }
    }

    @Override
    public Organization findByUserId(Long userId) {
        String sql = "SELECT * FROM organization WHERE user_id = ?";

        log.info("Finding organization profile for user ID: {}", userId);

        try {
            return jdbcTemplate.queryForObject(sql, organizationProfileRowMapper, userId);
        } catch (Exception e) {
            log.info("Organization profile not found for user ID: {}", userId);
            return null;
        }
    }

    @Override
    public void updateOrganizationProfile(Organization profile) {
        String sql = "UPDATE organization SET company_name = ?, industry = ?, company_size = ?, " +
                "website = ?, tax_id = ?, business_registration_number = ?, contact_person = ?, contact_person_role = ? " +
                "WHERE user_id = ?";

        log.info("Updating organization profile for user ID: {}", profile.getUserId());

        try {
            int rowsUpdated = jdbcTemplate.update(sql,
                    profile.getCompanyName(),
                    profile.getIndustry(),
                    profile.getCompanySize(),
                    profile.getWebsite(),
                    profile.getTaxId(),
                    profile.getBusinessRegistrationNumber(),
                    profile.getContactPerson(),
                    profile.getContactPersonRole(),
                    profile.getUserId()
            );

            if (rowsUpdated == 0) {
                log.warn("No organization profile found to update for user ID: {}", profile.getUserId());
            } else {
                log.info("Organization profile updated successfully for user ID: {}", profile.getUserId());
            }

        } catch (Exception e) {
            log.error("Failed to update organization profile for user {}: {}", profile.getUserId(), e.getMessage(), e);
            throw new RuntimeException("Failed to update organization profile: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteByUserId(Long userId) {
        String sql = "DELETE FROM organization WHERE user_id = ?";

        log.info("Deleting organization profile for user ID: {}", userId);

        try {
            int rowsDeleted = jdbcTemplate.update(sql, userId);
            log.info("Deleted {} organization profile(s) for user ID: {}", rowsDeleted, userId);
        } catch (Exception e) {
            log.error("Failed to delete organization profile for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete organization profile: " + e.getMessage(), e);
        }
    }
}