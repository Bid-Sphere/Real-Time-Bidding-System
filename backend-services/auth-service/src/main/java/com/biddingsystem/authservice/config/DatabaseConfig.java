package com.biddingsystem.authservice.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
@Log4j2
public class DatabaseConfig {

    @Bean
    public DataSource dataSource() {
        log.info("Initializing PostgreSQL DataSource");

        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl("jdbc:postgresql://ep-cool-heart-a4cf7091-pooler.us-east-1.aws.neon.tech:5432/neondb");
        dataSource.setUsername("neondb_owner");
        dataSource.setPassword("npg_N14CEqfSWGcj");
//        dataSource.setDriverClassName("org.postgresql.Driver");
//        dataSource.setUrl("jdbc:postgresql://localhost:5432/bidding_system");
//        dataSource.setUsername("postgres");
//        dataSource.setPassword("pass12345");

        log.info("DataSource configured for PostgreSQL");
        return dataSource;
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        log.info("Creating JdbcTemplate with provided DataSource");
        return new JdbcTemplate(dataSource);
    }
}