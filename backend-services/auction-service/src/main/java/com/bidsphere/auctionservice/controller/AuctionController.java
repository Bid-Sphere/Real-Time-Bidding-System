package com.bidsphere.auctionservice.controller;

import com.bidsphere.auctionservice.constant.AppConstants;
import com.bidsphere.auctionservice.constant.Endpoints;
import com.bidsphere.auctionservice.constant.SecurityConstants;
import com.bidsphere.auctionservice.dto.request.CreateAuctionRequest;
import com.bidsphere.auctionservice.dto.request.SubmitAuctionBidRequest;
import com.bidsphere.auctionservice.dto.request.CancelAuctionRequest;
import com.bidsphere.auctionservice.dto.response.*;
import com.bidsphere.auctionservice.model.ErrorResponse;
import com.bidsphere.auctionservice.service.interfaces.AuctionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(Endpoints.AUCTION_BASE)
@Log4j2
public class AuctionController {

    private final AuctionService auctionService;
    private final JdbcTemplate jdbcTemplate;

    public AuctionController(AuctionService auctionService, JdbcTemplate jdbcTemplate) {
        this.auctionService = auctionService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping(Endpoints.CREATE_AUCTION)
    public ResponseEntity<?> createAuction(
            @Valid @RequestBody CreateAuctionRequest request,
            HttpServletRequest servletRequest) {

        log.info("Received request to create auction for project: {}", request.getProjectId());

        try {
            AuctionDetailResponse auction = auctionService.createAuction(request);

            BaseResponse<AuctionDetailResponse> response = BaseResponse.success(
                    AppConstants.AUCTION_CREATED, auction);

            log.info("Auction created successfully: {}", auction.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            throw e;

        } catch (Exception e) {
            log.error("Create auction failed for project {}: {}",
                    request.getProjectId(), e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("AUCTION_CREATION_FAILED")
                    .message("Failed to create auction")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping(Endpoints.GET_AUCTION_BY_PROJECT)
    public ResponseEntity<?> getAuctionByProjectId(
            @PathVariable String projectId,
            HttpServletRequest servletRequest) {

        log.info("Getting auction for project ID: {}", projectId);

        try {
            AuctionDetailResponse auction = auctionService.getAuctionByProjectId(projectId);

            BaseResponse<AuctionDetailResponse> response = BaseResponse.success(auction);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Get auction failed for project {}: {}", projectId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("AUCTION_RETRIEVAL_FAILED")
                    .message("Failed to retrieve auction")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping(Endpoints.GET_AUCTION_BY_ID)
    public ResponseEntity<?> getAuctionById(
            @PathVariable String auctionId,
            HttpServletRequest servletRequest) {

        log.info("Getting auction by ID: {}", auctionId);

        try {
            AuctionDetailResponse auction = auctionService.getAuctionById(auctionId);

            BaseResponse<AuctionDetailResponse> response = BaseResponse.success(auction);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Get auction failed for ID {}: {}", auctionId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("AUCTION_RETRIEVAL_FAILED")
                    .message("Failed to retrieve auction")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping(Endpoints.GET_ACTIVE_AUCTIONS)
    public ResponseEntity<?> getActiveAuctions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            HttpServletRequest servletRequest) {

        log.info("Getting active auctions, page: {}, limit: {}", page, limit);

        try {
            ActiveAuctionsResponse auctions = auctionService.getActiveAuctions(page, limit);

            BaseResponse<ActiveAuctionsResponse> response = BaseResponse.success(auctions);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Get active auctions failed: {}", e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("ACTIVE_AUCTIONS_RETRIEVAL_FAILED")
                    .message("Failed to retrieve active auctions")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @PostMapping(Endpoints.SUBMIT_BID)
    public ResponseEntity<?> submitAuctionBid(
            @PathVariable String auctionId,
            @Valid @RequestBody SubmitAuctionBidRequest request,
            @RequestHeader(SecurityConstants.USER_ID_HEADER) String userId,
            @RequestHeader(SecurityConstants.USER_NAME_HEADER) String userName,
            @RequestHeader(SecurityConstants.ORG_ID_HEADER) String organizationId,
            HttpServletRequest servletRequest) {

        log.info("Submitting bid for auction: {}, user: {}, organization: {}",
                auctionId, userName, organizationId);

        try {
            AuctionBidResponse bidResponse = auctionService.submitBid(
                    auctionId, request, userId, userName, organizationId);

            BaseResponse<AuctionBidResponse> response = BaseResponse.success(
                    AppConstants.BID_SUBMITTED, bidResponse);

            log.info("Bid submitted successfully for auction: {}", auctionId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            throw e;

        } catch (Exception e) {
            log.error("Submit bid failed for auction {}: {}", auctionId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("BID_SUBMISSION_FAILED")
                    .message("Failed to submit bid")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping(Endpoints.GET_AUCTION_BIDS)
    public ResponseEntity<?> getAuctionBids(
            @PathVariable String auctionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            HttpServletRequest servletRequest) {

        log.info("Getting bids for auction: {}, page: {}, limit: {}", auctionId, page, limit);

        try {
            AuctionBidsResponse bids = auctionService.getAuctionBids(auctionId, page, limit);

            BaseResponse<AuctionBidsResponse> response = BaseResponse.success(bids);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Get bids failed for auction {}: {}", auctionId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("BID_RETRIEVAL_FAILED")
                    .message("Failed to retrieve bids")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @PostMapping(Endpoints.CLOSE_AUCTION)
    public ResponseEntity<?> closeAuction(
            @PathVariable String auctionId,
            HttpServletRequest servletRequest) {

        log.info("Closing auction: {}", auctionId);

        try {
            AuctionCloseResponse closeResponse = auctionService.closeAuction(auctionId);

            BaseResponse<AuctionCloseResponse> response = BaseResponse.success(
                    AppConstants.AUCTION_CLOSED, closeResponse);

            log.info("Auction closed successfully: {}", auctionId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Close auction failed for {}: {}", auctionId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("AUCTION_CLOSE_FAILED")
                    .message("Failed to close auction")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @PostMapping(Endpoints.CANCEL_AUCTION)
    public ResponseEntity<?> cancelAuction(
            @PathVariable String auctionId,
            @RequestBody(required = false) CancelAuctionRequest request,
            @RequestHeader(SecurityConstants.USER_ID_HEADER) String userId,
            HttpServletRequest servletRequest) {

        log.info("Cancelling auction: {}, requested by user: {}", auctionId, userId);

        try {
            if (request == null) {
                request = new CancelAuctionRequest();
            }

            BaseResponse<Void> response = auctionService.cancelAuction(auctionId, request, userId);

            log.info("Auction cancelled successfully: {}", auctionId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            throw e;

        } catch (Exception e) {
            log.error("Cancel auction failed for {}: {}", auctionId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("AUCTION_CANCELLATION_FAILED")
                    .message("Failed to cancel auction")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping(Endpoints.GET_MY_BIDS)
    public ResponseEntity<?> getMyAuctionBids(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestHeader(SecurityConstants.ORG_ID_HEADER) String organizationId,
            HttpServletRequest servletRequest) {

        log.info("Getting bids for organization: {}, status: {}", organizationId, status);

        try {
            MyAuctionBidsResponse myBids = auctionService.getMyAuctionBids(
                    organizationId, status, page, limit);

            BaseResponse<MyAuctionBidsResponse> response = BaseResponse.success(myBids);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Get my bids failed for organization {}: {}", organizationId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("MY_BIDS_RETRIEVAL_FAILED")
                    .message("Failed to retrieve my bids")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping(Endpoints.GET_AUCTION_STATS)
    public ResponseEntity<?> getAuctionStats(
            @PathVariable String auctionId,
            HttpServletRequest servletRequest) {

        log.info("Getting statistics for auction: {}", auctionId);

        try {
            AuctionStatsResponse stats = auctionService.getAuctionStats(auctionId);

            BaseResponse<AuctionStatsResponse> response = BaseResponse.success(stats);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Get stats failed for auction {}: {}", auctionId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("STATS_RETRIEVAL_FAILED")
                    .message("Failed to retrieve statistics")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping(Endpoints.HEALTH)
    public ResponseEntity<Map<String, Object>> health() {
        log.debug("Health check endpoint called");

        Map<String, Object> response = new HashMap<>();
        response.put("service", "Auction Service");
        response.put("status", "HEALTHY");
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @GetMapping(Endpoints.DB_HEALTH)
    public ResponseEntity<?> databaseHealth(HttpServletRequest servletRequest) {
        log.info("Checking database health...");

        try {
            // Test basic connection and query
            String version = jdbcTemplate.queryForObject("SELECT version()", String.class);
            String currentTime = jdbcTemplate.queryForObject("SELECT NOW()", String.class);
            Integer auctionCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM auctions", Integer.class);
            Integer bidCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM auction_bids", Integer.class);

            Map<String, Object> healthStatus = new HashMap<>();
            healthStatus.put("status", "HEALTHY");
            healthStatus.put("database", "PostgreSQL");
            healthStatus.put("version", version);
            healthStatus.put("current_time", currentTime);
            healthStatus.put("auction_count", auctionCount != null ? auctionCount : 0);
            healthStatus.put("bid_count", bidCount != null ? bidCount : 0);
            healthStatus.put("timestamp", LocalDateTime.now());

            log.info("Database health check: HEALTHY");
            return ResponseEntity.ok(healthStatus);

        } catch (Exception e) {
            log.error("Database health check: UNHEALTHY - {}", e.getMessage());

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("DATABASE_CONNECTION_ERROR")
                    .message("Database connection failed")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(errorResponse);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> serviceStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "Auction Service");
        status.put("status", "RUNNING");
        status.put("version", "1.0.0");
        status.put("timestamp", LocalDateTime.now());
        status.put("endpoints", new String[]{
                Endpoints.CREATE_AUCTION,
                Endpoints.GET_ACTIVE_AUCTIONS,
                Endpoints.SUBMIT_BID,
                Endpoints.GET_AUCTION_BIDS,
                Endpoints.GET_MY_BIDS,
                Endpoints.HEALTH_ENDPOINT,
                Endpoints.DB_HEALTH_ENDPOINT
        });

        return ResponseEntity.ok(status);
    }

    @GetMapping("/headers-test")
    public ResponseEntity<Map<String, Object>> headersTest(@RequestHeader Map<String, String> headers) {
        log.info("Headers test endpoint called");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("headers", headers);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/db-config")
    public ResponseEntity<Map<String, String>> showDbConfig() {
        Map<String, String> config = new HashMap<>();

        // Log environment variables (mask passwords)
        String url = System.getenv("SPRING_DATASOURCE_URL");
        String username = System.getenv("SPRING_DATASOURCE_USERNAME");
        String password = System.getenv("SPRING_DATASOURCE_PASSWORD");

        config.put("url", url != null ? url : "Not set");
        config.put("username", username != null ? username : "Not set");
        config.put("password_length", password != null ? String.valueOf(password.length()) : "0");
        config.put("driver", System.getenv("SPRING_DATASOURCE_DRIVER_CLASS_NAME") != null ?
                System.getenv("SPRING_DATASOURCE_DRIVER_CLASS_NAME") : "org.postgresql.Driver");

        log.debug("Database configuration: URL={}, Username={}",
                url != null ? maskUrl(url) : "Not set",
                username != null ? username : "Not set");

        return ResponseEntity.ok(config);
    }

    private String maskUrl(String url) {
        // Mask password in URL for logging
        if (url == null) return null;
        if (url.contains("@")) {
            return url.substring(0, url.indexOf("//") + 2) + "***@***";
        }
        return url;
    }

    @GetMapping(Endpoints.CORS_TEST)
    public ResponseEntity<Map<String, Object>> corsTest(
            @RequestHeader(value = "Origin", required = false) String origin,
            HttpServletRequest request) {
        log.info("CORS test endpoint called from origin: {}", origin);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "CORS is properly configured!");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("requestOrigin", origin);
        response.put("requestPath", request.getRequestURI());
        response.put("allowedMethods", "GET, POST, PUT, DELETE, OPTIONS");
        response.put("allowedHeaders", "Authorization, Content-Type, X-User-Id, X-User-Name, X-Organization-Id");

        return ResponseEntity.ok(response);
    }
}