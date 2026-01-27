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

    @Value("${cors.allowed.origins:*}")
    private String corsAllowedOrigins;

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
        log.info("CORS Allowed Origins: {}", corsAllowedOrigins);

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - note: context path /auth is already stripped by Spring
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/health").permitAll()
                        .requestMatchers("/health").permitAll()
                        .requestMatchers("/db-health").permitAll()
                        .requestMatchers("/cors-test").permitAll()
                        .requestMatchers("/headers-test").permitAll()
                        .requestMatchers("/db-config").permitAll()
                        .requestMatchers("/status").permitAll()
                        .requestMatchers("/error").permitAll()
                        // Role-based endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/client/**").hasRole("CLIENT")
                        .requestMatchers("/api/organisation/**").hasRole("ORGANISATION")
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

        // Parse allowed origins from environment variable
        if ("*".equals(corsAllowedOrigins)) {
            // Allow all origins for local development
            corsConfig.setAllowedOriginPatterns(Arrays.asList("*"));
            corsConfig.setAllowCredentials(false); // Cannot use credentials with wildcard
            log.info("CORS: Allowing all origins (local development mode)");
        } else {
            // Production mode - use specific origins
            String[] origins = corsAllowedOrigins.split(",");
            corsConfig.setAllowedOrigins(Arrays.asList(origins));
            corsConfig.setAllowCredentials(true);
            log.info("CORS: Allowing specific origins: {}", Arrays.toString(origins));
        }

        // Allowed HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"
        ));

        // Allow all headers - this is important for preflight requests
        corsConfig.setAllowedHeaders(Arrays.asList("*"));

        // Exposed headers (headers that browsers are allowed to access)
        corsConfig.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Disposition",
                "Content-Length",
                "Content-Type"
        ));

        corsConfig.setMaxAge(3600L); // Cache preflight request for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);  // Apply CORS configuration globally

        log.info("CORS Configuration loaded successfully");

        return source;
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }
}