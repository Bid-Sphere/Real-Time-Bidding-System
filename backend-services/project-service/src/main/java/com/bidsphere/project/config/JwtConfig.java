package com.bidsphere.project.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
@Slf4j
public class JwtConfig {

    private String secret;
    private long expiration;
    private String issuer;

    @PostConstruct
    public void init() {
        log.info("JWT Configuration loaded - Secret: {}, Expiration: {} ms, Issuer: {}",
                secret != null ? "***" : "NULL", expiration, issuer);
    }

    public String getSecret() {
        return secret;
    }

    public long getExpiration() {
        return expiration;
    }

    public String getIssuer() {
        return issuer;
    }
}
