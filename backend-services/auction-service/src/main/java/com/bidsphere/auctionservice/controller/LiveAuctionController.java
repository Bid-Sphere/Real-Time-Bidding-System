package com.bidsphere.auctionservice.controller;

import com.bidsphere.auctionservice.constant.SecurityConstants;
import com.bidsphere.auctionservice.dto.request.SubmitLiveBidRequest;
import com.bidsphere.auctionservice.dto.response.AuctionDetailResponse;
import com.bidsphere.auctionservice.dto.response.BaseResponse;
import com.bidsphere.auctionservice.dto.response.BidDTO;
import com.bidsphere.auctionservice.dto.response.LiveAuctionStateDTO;
import com.bidsphere.auctionservice.model.ErrorResponse;
import com.bidsphere.auctionservice.service.interfaces.LiveAuctionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * REST Controller for live auction operations including real-time bidding.
 * Handles auction lifecycle (go live, end) and bid management (submit, accept, reject).
 * 
 * Requirements: 1.1, 2.1, 4.1, 4.4, 7.1, 8.1, 9.1, 9.2, 9.3, 9.4
 */
@RestController
@RequestMapping("/api/auctions")
@Log4j2
public class LiveAuctionController {

    private final LiveAuctionService liveAuctionService;

    public LiveAuctionController(LiveAuctionService liveAuctionService) {
        this.liveAuctionService = liveAuctionService;
    }

    /**
     * Transition a scheduled auction to LIVE status.
     * Only clients can start their own auctions.
     * 
     * Requirements: 1.1, 9.2
     * 
     * @param auctionId The auction ID to start
     * @param userId The client user ID from custom header
     * @param servletRequest The HTTP request
     * @return The updated auction with LIVE status
     */
    @PostMapping("/{auctionId}/go-live")
    public ResponseEntity<?> goLive(
            @PathVariable String auctionId,
            @RequestHeader(SecurityConstants.USER_ID_HEADER) String userId,
            HttpServletRequest servletRequest) {

        log.info("Request to go live for auction: {}, client user: {}", auctionId, userId);

        try {
            AuctionDetailResponse auction = liveAuctionService.goLive(auctionId, userId);

            BaseResponse<AuctionDetailResponse> response = BaseResponse.success(
                    "Auction is now live", auction);

            log.info("Auction {} successfully transitioned to LIVE status", auctionId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("Go live failed for auction {}: {}", auctionId, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Go live failed for auction {}: {}", auctionId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("GO_LIVE_FAILED")
                    .message("Failed to start auction")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    /**
     * Submit a bid to a live auction.
     * Only organizations can submit bids.
     * 
     * Requirements: 2.1, 9.3
     * 
     * @param auctionId The auction ID
     * @param request The bid submission request containing amount
     * @param organizationId The organization ID from custom header
     * @param organizationName The organization name from custom header (optional)
     * @param servletRequest The HTTP request
     * @return The created bid with PENDING status
     */
    @PostMapping("/{auctionId}/bids")
    public ResponseEntity<?> submitBid(
            @PathVariable String auctionId,
            @Valid @RequestBody SubmitLiveBidRequest request,
            @RequestHeader(SecurityConstants.ORG_ID_HEADER) String organizationId,
            @RequestHeader(value = SecurityConstants.ORG_NAME_HEADER, required = false) String organizationName,
            HttpServletRequest servletRequest) {

        log.info("Submitting live bid for auction: {}, organization: {}, amount: {}",
                auctionId, organizationId, request.getAmount());

        try {
            BidDTO bid = liveAuctionService.submitBid(
                    auctionId, organizationId, organizationName, request.getAmount());

            BaseResponse<BidDTO> response = BaseResponse.success(
                    "Bid submitted successfully", bid);

            log.info("Bid submitted successfully for auction: {}, bid ID: {}", auctionId, bid.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            log.warn("Bid submission failed for auction {}: {}", auctionId, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Bid submission failed for auction {}: {}", auctionId, e.getMessage(), e);

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

    /**
     * Accept a pending bid, making it the current winner.
     * Only clients can accept bids on their auctions.
     * 
     * Requirements: 4.1, 9.2
     * 
     * @param auctionId The auction ID
     * @param bidId The bid ID to accept
     * @param userId The client user ID from custom header
     * @param servletRequest The HTTP request
     * @return The updated bid with ACCEPTED status
     */
    @PutMapping("/{auctionId}/bids/{bidId}/accept")
    public ResponseEntity<?> acceptBid(
            @PathVariable String auctionId,
            @PathVariable String bidId,
            @RequestHeader(SecurityConstants.USER_ID_HEADER) String userId,
            HttpServletRequest servletRequest) {

        log.info("Request to accept bid: {} for auction: {}, client user: {}",
                bidId, auctionId, userId);

        try {
            BidDTO bid = liveAuctionService.acceptBid(auctionId, bidId, userId);

            BaseResponse<BidDTO> response = BaseResponse.success(
                    "Bid accepted successfully", bid);

            log.info("Bid {} accepted for auction {}", bidId, auctionId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("Bid acceptance failed for bid {}: {}", bidId, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Bid acceptance failed for bid {}: {}", bidId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("BID_ACCEPTANCE_FAILED")
                    .message("Failed to accept bid")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    /**
     * Reject a pending bid.
     * Only clients can reject bids on their auctions.
     * 
     * Requirements: 4.4, 9.2
     * 
     * @param auctionId The auction ID
     * @param bidId The bid ID to reject
     * @param userId The client user ID from custom header
     * @param servletRequest The HTTP request
     * @return The updated bid with REJECTED status
     */
    @PutMapping("/{auctionId}/bids/{bidId}/reject")
    public ResponseEntity<?> rejectBid(
            @PathVariable String auctionId,
            @PathVariable String bidId,
            @RequestHeader(SecurityConstants.USER_ID_HEADER) String userId,
            HttpServletRequest servletRequest) {

        log.info("Request to reject bid: {} for auction: {}, client user: {}",
                bidId, auctionId, userId);

        try {
            BidDTO bid = liveAuctionService.rejectBid(auctionId, bidId, userId);

            BaseResponse<BidDTO> response = BaseResponse.success(
                    "Bid rejected successfully", bid);

            log.info("Bid {} rejected for auction {}", bidId, auctionId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("Bid rejection failed for bid {}: {}", bidId, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Bid rejection failed for bid {}: {}", bidId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("BID_REJECTION_FAILED")
                    .message("Failed to reject bid")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    /**
     * Get the current live state of an auction.
     * Used by late joiners to get current accepted bid, recent bids, and remaining time.
     * 
     * Requirements: 8.1, 9.1
     * 
     * @param auctionId The auction ID
     * @param servletRequest The HTTP request
     * @return The live auction state including current winner and recent bids
     */
    @GetMapping("/{auctionId}/live-state")
    public ResponseEntity<?> getLiveState(
            @PathVariable String auctionId,
            HttpServletRequest servletRequest) {

        log.info("Request for live state of auction: {}", auctionId);

        try {
            LiveAuctionStateDTO liveState = liveAuctionService.getLiveState(auctionId);

            BaseResponse<LiveAuctionStateDTO> response = BaseResponse.success(liveState);

            log.info("Live state retrieved for auction: {}", auctionId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("Get live state failed for auction {}: {}", auctionId, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Get live state failed for auction {}: {}", auctionId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("LIVE_STATE_RETRIEVAL_FAILED")
                    .message("Failed to retrieve live auction state")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    /**
     * End a live auction and determine the winner.
     * Only clients can end their own auctions.
     * 
     * Requirements: 7.1, 9.2
     * 
     * @param auctionId The auction ID to end
     * @param userId The client user ID from custom header
     * @param servletRequest The HTTP request
     * @return The updated auction with ENDED status and winner information
     */
    @PostMapping("/{auctionId}/end")
    public ResponseEntity<?> endAuction(
            @PathVariable String auctionId,
            @RequestHeader(SecurityConstants.USER_ID_HEADER) String userId,
            HttpServletRequest servletRequest) {

        log.info("Request to end auction: {}, client user: {}", auctionId, userId);

        try {
            AuctionDetailResponse auction = liveAuctionService.endAuction(auctionId);

            BaseResponse<AuctionDetailResponse> response = BaseResponse.success(
                    "Auction ended successfully", auction);

            log.info("Auction {} ended successfully", auctionId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("End auction failed for auction {}: {}", auctionId, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("End auction failed for auction {}: {}", auctionId, e.getMessage(), e);

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .error("END_AUCTION_FAILED")
                    .message("Failed to end auction")
                    .timestamp(LocalDateTime.now())
                    .path(servletRequest.getRequestURI())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }
}
