package com.bidsphere.auctionservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig
{

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/api/auctions",
                                "/api/auctions/health",
                                "/api/auctions/project/**",
                                "/api/auctions/active",
                                "/api/auctions/{auctionId}",
                                "/api/auctions/{auctionId}/bids",
                                "/api/auctions/{auctionId}/my-bids",
                                "/api/auctions/{auctionId}/stats",
                                "/swagger-ui/**",
                                "/api-docs/**"
                        ).permitAll()
                        // Authenticated endpoints
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}