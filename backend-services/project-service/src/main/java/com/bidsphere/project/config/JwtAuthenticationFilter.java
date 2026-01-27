package com.bidsphere.project.config;

import com.bidsphere.project.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Handle CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        final String userId;
        final String role;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("No Bearer token found in request to: {}", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        log.debug("JWT token extracted from request to: {}", request.getRequestURI());

        try {
            // Validate token
            if (!jwtUtil.validateToken(jwt)) {
                log.warn("Invalid JWT token");
                filterChain.doFilter(request, response);
                return;
            }

            // Extract user information from token
            userEmail = jwtUtil.extractUsername(jwt);
            userId = jwtUtil.extractUserId(jwt);
            role = jwtUtil.extractRole(jwt);

            log.debug("Extracted from JWT - Email: {}, UserId: {}, Role: {}", userEmail, userId, role);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Create authentication token with user details
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userEmail,
                        null,
                        Collections.singletonList(authority)
                );

                // Add custom details (userId, role) to authentication
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Store userId and role in request attributes for controller access
                request.setAttribute("userId", userId);
                request.setAttribute("userEmail", userEmail);
                request.setAttribute("userRole", role);

                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.info("User authenticated successfully: {} ({})", userEmail, role);
            }
        } catch (Exception e) {
            log.error("Error during JWT authentication: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
}
