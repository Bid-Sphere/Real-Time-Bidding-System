package com.biddingsystem.bidding.controller;

import com.biddingsystem.bidding.dto.request.RejectBidRequest;
import com.biddingsystem.bidding.dto.request.SubmitBidRequest;
import com.biddingsystem.bidding.dto.request.UpdateBidRequest;
import com.biddingsystem.bidding.dto.response.ApiResponse;
import com.biddingsystem.bidding.dto.response.BidActionResponse;
import com.biddingsystem.bidding.dto.response.BidResponse;
import com.biddingsystem.bidding.dto.response.BidStatsResponse;
import com.biddingsystem.bidding.enums.BidStatus;
import com.biddingsystem.bidding.service.BidService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "*")
@Slf4j
public class BidController {
    
    private final BidService bidService;
    
    public BidController(BidService bidService) {
        this.bidService = bidService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<BidResponse>> submitBid(
            @Valid @RequestBody SubmitBidRequest request,
            HttpServletRequest httpRequest) {
        
        // Extract user info from JWT token (set by JwtAuthenticationFilter)
        String bidderId = (String) httpRequest.getAttribute("userId");
        String bidderName = (String) httpRequest.getAttribute("userEmail");
        String role = (String) httpRequest.getAttribute("userRole");
        
        log.info("Submitting bid for project: {} by bidder: {}", request.getProjectId(), bidderId);
        
        if (!"ORGANIZATION".equals(role) && !"ORGANISATION".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only organizations can submit bids"));
        }
        
        BidResponse response = bidService.submitBid(request, bidderId, bidderName);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bid submitted successfully", response));
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<Page<BidResponse>>> getBidsForProject(
            @PathVariable String projectId,
            @RequestParam(required = false) BidStatus status,
            @RequestParam(defaultValue = "date_desc") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            HttpServletRequest httpRequest) {
        
        // Extract user info (optional for this endpoint)
        String userId = (String) httpRequest.getAttribute("userId");
        String userRole = (String) httpRequest.getAttribute("userRole");
        
        log.info("Getting bids for project: {}", projectId);
        
        if (limit > 100) limit = 100;
        
        Pageable pageable = PageRequest.of(page, limit);
        Page<BidResponse> bids = bidService.getBidsForProject(projectId, status, sort, pageable, userId, userRole);
        
        return ResponseEntity.ok(ApiResponse.success(bids));
    }
    
    @GetMapping("/my-bids")
    public ResponseEntity<ApiResponse<Page<BidResponse>>> getMyBids(
            @RequestParam(required = false) BidStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            HttpServletRequest httpRequest) {
        
        // Extract user info from JWT token
        String bidderId = (String) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");
        
        log.info("Getting my bids for bidder: {}", bidderId);
        
        if (!"ORGANIZATION".equals(role) && !"ORGANISATION".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only organizations can access this endpoint"));
        }
        
        if (limit > 100) limit = 100;
        
        Pageable pageable = PageRequest.of(page, limit);
        Page<BidResponse> bids = bidService.getMyBids(bidderId, status, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(bids));
    }
    
    @GetMapping("/{bidId}")
    public ResponseEntity<ApiResponse<BidResponse>> getBidById(
            @PathVariable String bidId,
            HttpServletRequest httpRequest) {
        
        // Extract user info from JWT token
        String userId = (String) httpRequest.getAttribute("userId");
        String userRole = (String) httpRequest.getAttribute("userRole");
        
        log.info("Getting bid: {} for user: {}", bidId, userId);
        
        BidResponse response = bidService.getBidById(bidId, userId, userRole);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PutMapping("/{bidId}")
    public ResponseEntity<ApiResponse<BidResponse>> updateBid(
            @PathVariable String bidId,
            @Valid @RequestBody UpdateBidRequest request,
            HttpServletRequest httpRequest) {
        
        // Extract user info from JWT token
        String bidderId = (String) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");
        
        log.info("Updating bid: {} by bidder: {}", bidId, bidderId);
        
        if (!"ORGANIZATION".equals(role) && !"ORGANISATION".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only organizations can update bids"));
        }
        
        BidResponse response = bidService.updateBid(bidId, request, bidderId);
        
        return ResponseEntity.ok(
                ApiResponse.success("Bid updated successfully", response)
        );
    }
    
    @DeleteMapping("/{bidId}")
    public ResponseEntity<ApiResponse<Void>> withdrawBid(
            @PathVariable String bidId,
            HttpServletRequest httpRequest) {
        
        // Extract user info from JWT token
        String bidderId = (String) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");
        
        log.info("Withdrawing bid: {} by bidder: {}", bidId, bidderId);
        
        if (!"ORGANIZATION".equals(role) && !"ORGANISATION".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only organizations can withdraw bids"));
        }
        
        bidService.withdrawBid(bidId, bidderId);
        
        return ResponseEntity.ok(
                ApiResponse.success("Bid withdrawn successfully", null)
        );
    }
    
    @PostMapping("/{bidId}/accept")
    public ResponseEntity<ApiResponse<BidActionResponse>> acceptBid(
            @PathVariable String bidId,
            HttpServletRequest httpRequest) {
        
        // Extract user info from JWT token
        String clientId = (String) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");
        
        log.info("Accepting bid: {} by client: {} with role: {}", bidId, clientId, role);
        
        // Accept both CLIENT and INDIVIDUAL spellings
        if (!"CLIENT".equals(role) && !"INDIVIDUAL".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only clients can accept bids"));
        }
        
        BidActionResponse response = bidService.acceptBid(bidId, clientId);
        
        return ResponseEntity.ok(
                ApiResponse.success("Bid accepted successfully", response)
        );
    }
    
    @PostMapping("/{bidId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectBid(
            @PathVariable String bidId,
            @RequestBody(required = false) RejectBidRequest request,
            HttpServletRequest httpRequest) {
        
        // Extract user info from JWT token
        String clientId = (String) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");
        
        log.info("Rejecting bid: {} by client: {} with role: {}", bidId, clientId, role);
        
        // Accept both CLIENT and INDIVIDUAL spellings
        if (!"CLIENT".equals(role) && !"INDIVIDUAL".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only clients can reject bids"));
        }
        
        if (request == null) {
            request = new RejectBidRequest();
        }
        
        bidService.rejectBid(bidId, request, clientId);
        
        return ResponseEntity.ok(
                ApiResponse.success("Bid rejected successfully", null)
        );
    }
    
    @GetMapping("/project/{projectId}/stats")
    public ResponseEntity<ApiResponse<BidStatsResponse>> getBidStats(
            @PathVariable String projectId) {
        
        log.info("Getting bid statistics for project: {}", projectId);
        
        BidStatsResponse stats = bidService.getBidStats(projectId);
        
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
    
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
                ApiResponse.success("Bidding Service is running", "OK")
        );
    }
}
