package com.biddingsystem.authservice.config;

import com.biddingsystem.authservice.service.impl.UserServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
//@RequiredArgsConstructor
@Slf4j
public class SecurityConfig
{
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserServiceImpl userService;

    @Value("${frontend.url:https://spherebid.vercel.app}")
    private String frontEndUrl;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, UserServiceImpl userService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userService = userService;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("Configuring security filter chain");
        log.info("Frontend URL for CORS: {}", frontEndUrl);

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/api/health", "/error").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/client/**").hasRole("CLIENT")
                        .requestMatchers("/api/organisation/**").hasRole("ORGANISATION")
                        .requestMatchers("/api/freelancer/**").hasRole("FREELANCER")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        log.info("Security configuration completed");
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // Allow your Vercel frontend URL and common development URLs
        corsConfig.setAllowedOrigins(Arrays.asList(
                frontEndUrl,
                "https://spherebid.vercel.app",
                "http://localhost:3000"  // Local development
        ));

        // Allowed HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"
        ));

        // Allowed headers
        corsConfig.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "X-Requested-With",
                "Cache-Control",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
                "userId",  // Your custom header
                "X-Forwarded-For",
                "X-Forwarded-Proto",
                "X-Forwarded-Port"
        ));

        // Exposed headers (headers that browsers are allowed to access)
        corsConfig.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Disposition",
                "Content-Length",
                "Content-Type",
                "Date",
                "Server"
        ));

        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L); // Cache preflight request for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);  // Apply CORS configuration globally

        log.info("CORS Configuration loaded successfully");
        log.info("Allowed Origins: {}", corsConfig.getAllowedOrigins());
        log.info("Allowed Methods: {}", corsConfig.getAllowedMethods());
        log.info("Allowed Headers: {}", corsConfig.getAllowedHeaders());

        return source;
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }
}