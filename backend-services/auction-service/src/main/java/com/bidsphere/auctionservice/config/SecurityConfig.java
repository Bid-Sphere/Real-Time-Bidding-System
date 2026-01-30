package com.bidsphere.auctionservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig
{
    @Value("${cors.allowed.origins:*}")
    private String corsAllowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Allow OPTIONS requests for CORS preflight
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Parse allowed origins from environment variable
        if ("*".equals(corsAllowedOrigins)) {
            // Allow all origins for local development
            configuration.setAllowedOriginPatterns(Arrays.asList("*"));
            configuration.setAllowCredentials(true); // Allow credentials with origin patterns
            System.out.println("CORS: Allowing all origins (local development mode)");
        } else {
            // Production mode - use specific origins
            String[] origins = corsAllowedOrigins.split(",");
            configuration.setAllowedOrigins(Arrays.asList(origins));
            configuration.setAllowCredentials(true);
            System.out.println("CORS: Allowing specific origins: " + Arrays.toString(origins));
        }
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}