package com.biddingsystem.authservice.repository.impl;

import com.biddingsystem.authservice.model.Freelancer;
import com.biddingsystem.authservice.repository.interfaces.FreelancerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

@Repository
public class FreelancerRepositoryImpl implements FreelancerRepository {
    private static final Logger log = LoggerFactory.getLogger(FreelancerRepositoryImpl.class);

    private final JdbcTemplate jdbcTemplate;

    public FreelancerRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Freelancer> freelancerProfileRowMapper = new RowMapper<Freelancer>() {
        @Override
        public Freelancer mapRow(ResultSet rs, int rowNum) throws SQLException {
            Freelancer profile = new Freelancer();
            profile.setId(rs.getLong("id"));
            profile.setUserId(rs.getLong("user_id"));
            profile.setProfessionalTitle(rs.getString("professional_title"));

            // Convert skills string to list
            String skillsString = rs.getString("skills");
            if (skillsString != null && !skillsString.isEmpty()) {
                List<String> skills = Arrays.asList(skillsString.split(","));
                profile.setSkills(skills);
            }

            profile.setExperienceLevel(rs.getString("experience_level"));
            profile.setHourlyRate(rs.getDouble("hourly_rate"));
            profile.setPortfolioUrl(rs.getString("portfolio_url"));
            profile.setBio(rs.getString("bio"));
            profile.setTotalProjects(rs.getInt("total_projects"));

            Double rating = rs.getDouble("rating");
            if (!rs.wasNull()) {
                profile.setRating(rating);
            }

            profile.setResumeUrl(rs.getString("resume_url"));
            return profile;
        }
    };

    @Override
    public Long saveFreelancerProfile(Freelancer profile) {
        String sql = "INSERT INTO freelancer (user_id, professional_title, skills, experience_level, " +
                "hourly_rate, portfolio_url, bio, total_projects, rating, resume_url) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";

        log.info("Saving freelancer profile for user ID: {}", profile.getUserId());

        try {
            // Convert skills list to comma-separated string
            String skillsString = null;
            if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
                skillsString = String.join(",", profile.getSkills());
            }

            Long profileId = jdbcTemplate.queryForObject(sql, Long.class,
                    profile.getUserId(),
                    profile.getProfessionalTitle(),
                    skillsString,
                    profile.getExperienceLevel(),
                    profile.getHourlyRate(),
                    profile.getPortfolioUrl(),
                    profile.getBio(),
                    profile.getTotalProjects() != null ? profile.getTotalProjects() : 0,
                    profile.getRating(),
                    profile.getResumeUrl()
            );

            log.info("Freelancer profile saved with ID: {}", profileId);
            return profileId;

        } catch (Exception e) {
            log.error("Failed to save freelancer profile for user {}: {}", profile.getUserId(), e.getMessage(), e);
            throw new RuntimeException("Failed to save freelancer profile: " + e.getMessage(), e);
        }
    }

    @Override
    public Freelancer findByUserId(Long userId) {
        String sql = "SELECT * FROM freelancer WHERE user_id = ?";

        log.info("Finding freelancer profile for user ID: {}", userId);

        try {
            return jdbcTemplate.queryForObject(sql, freelancerProfileRowMapper, userId);
        } catch (Exception e) {
            log.info("Freelancer profile not found for user ID: {}", userId);
            return null;
        }
    }

    @Override
    public void updateFreelancerProfile(Freelancer profile) {
        String sql = "UPDATE freelancer SET professional_title = ?, skills = ?, experience_level = ?, " +
                "hourly_rate = ?, portfolio_url = ?, bio = ?, total_projects = ?, rating = ?, resume_url = ? " +
                "WHERE user_id = ?";

        log.info("Updating freelancer profile for user ID: {}", profile.getUserId());

        try {
            // Convert skills list to comma-separated string
            String skillsString = null;
            if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
                skillsString = String.join(",", profile.getSkills());
            }

            int rowsUpdated = jdbcTemplate.update(sql,
                    profile.getProfessionalTitle(),
                    skillsString,
                    profile.getExperienceLevel(),
                    profile.getHourlyRate(),
                    profile.getPortfolioUrl(),
                    profile.getBio(),
                    profile.getTotalProjects(),
                    profile.getRating(),
                    profile.getResumeUrl(),
                    profile.getUserId()
            );

            if (rowsUpdated == 0) {
                log.warn("No freelancer profile found to update for user ID: {}", profile.getUserId());
            } else {
                log.info("Freelancer profile updated successfully for user ID: {}", profile.getUserId());
            }

        } catch (Exception e) {
            log.error("Failed to update freelancer profile for user {}: {}", profile.getUserId(), e.getMessage(), e);
            throw new RuntimeException("Failed to update freelancer profile: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteByUserId(Long userId) {
        String sql = "DELETE FROM freelancer WHERE user_id = ?";

        log.info("Deleting freelancer profile for user ID: {}", userId);

        try {
            int rowsDeleted = jdbcTemplate.update(sql, userId);
            log.info("Deleted {} freelancer profile(s) for user ID: {}", rowsDeleted, userId);
        } catch (Exception e) {
            log.error("Failed to delete freelancer profile for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete freelancer profile: " + e.getMessage(), e);
        }
    }
}