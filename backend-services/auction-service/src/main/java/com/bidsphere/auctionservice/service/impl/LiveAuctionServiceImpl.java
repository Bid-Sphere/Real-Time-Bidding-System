package com.bidsphere.auctionservice.service.impl;

import com.bidsphere.auctionservice.constant.AuctionStatus;
import com.bidsphere.auctionservice.constant.BidStatus;
import com.bidsphere.auctionservice.dto.response.AuctionDetailResponse;
import com.bidsphere.auctionservice.dto.response.AuctionStatusChangeDTO;
import com.bidsphere.auctionservice.dto.response.BidDTO;
import com.bidsphere.auctionservice.dto.response.LiveAuctionStateDTO;
import com.bidsphere.auctionservice.exception.AuctionException;
import com.bidsphere.auctionservice.exception.InvalidBidException;
import com.bidsphere.auctionservice.exception.ResourceNotFoundException;
import com.bidsphere.auctionservice.model.Auction;
import com.bidsphere.auctionservice.model.AuctionBid;
import com.bidsphere.auctionservice.repository.interfaces.AuctionBidRepository;
import com.bidsphere.auctionservice.repository.interfaces.AuctionRepository;
import com.bidsphere.auctionservice.service.interfaces.LiveAuctionService;
import com.bidsphere.auctionservice.validator.BidValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of LiveAuctionService for managing live auction operations.
 */
@Service
@Slf4j
public class LiveAuctionServiceImpl implements LiveAuctionService {

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private AuctionBidRepository auctionBidRepository;

    @Autowired
    private BidValidator bidValidator;

    @Autowired
    private RealtimeNotificationService realtimeNotificationService;

    /**
     * Transition an auction from SCHEDULED to LIVE status.
     * Requirements: 1.1, 1.4, 1.5
     */
    @Override
    @Transactional
    public AuctionDetailResponse goLive(String auctionId, String clientUserId) {
        log.info("Starting goLive for auction: {}, clientUserId: {}", auctionId, clientUserId);

        // Find the auction
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found with ID: " + auctionId));

        // Validate auction is in SCHEDULED status
        if (auction.getStatus() != AuctionStatus.SCHEDULED) {
            throw new AuctionException("Cannot start auction. Current status: " + auction.getStatus() + 
                    ". Auction must be in SCHEDULED status to go live.");
        }

        // Store old status for notification
        AuctionStatus oldStatus = auction.getStatus();

        // Update status to LIVE (ACTIVE in the current system)
        auction.setStatus(AuctionStatus.ACTIVE);
        
        // Set actual start time to current timestamp
        auction.setStartTime(LocalDateTime.now());
        
        // Persist changes to database
        int updated = auctionRepository.update(auction);
        if (updated == 0) {
            throw new AuctionException("Failed to update auction status");
        }

        log.info("Auction {} transitioned to LIVE status", auctionId);

        // Notify realtime service about status change
        AuctionStatusChangeDTO statusChange = AuctionStatusChangeDTO.builder()
                .auctionId(auctionId)
                .oldStatus(oldStatus)
                .newStatus(AuctionStatus.ACTIVE)
                .timestamp(LocalDateTime.now())
                .build();
        
        realtimeNotificationService.notifyAuctionStatusChange(statusChange);

        // Build and return response
        return buildAuctionDetailResponse(auction);
    }

    /**
     * Submit a new bid to a live auction.
     * Requirements: 2.1, 2.2, 2.4, 2.6
     */
    @Override
    @Transactional
    public BidDTO submitBid(String auctionId, String organizationId, String organizationName, BigDecimal amount) {
        log.info("Submitting bid for auction: {}, organization: {}, amount: {}", 
                auctionId, organizationName, amount);

        // Find the auction
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found with ID: " + auctionId));

        // Validate bid using BidValidator
        bidValidator.validateBid(auction, amount);

        // Create AuctionBid entity with PENDING status
        AuctionBid bid = new AuctionBid();
        bid.setAuctionId(auctionId);
        bid.setOrganizationId(organizationId);
        bid.setBidderId(organizationId); // Using organizationId as bidderId
        bid.setBidderName(organizationName);
        bid.setBidAmount(amount);
        bid.setBidStatus(BidStatus.PENDING);
        bid.setBidTime(LocalDateTime.now());
        bid.setIsWinning(false);

        // Persist bid to database
        AuctionBid savedBid = auctionBidRepository.save(bid);
        if (savedBid == null || savedBid.getId() == null) {
            throw new AuctionException("Failed to save bid");
        }

        log.info("Bid saved with ID: {}", savedBid.getId());

        // Determine if this is the current lowest bid
        boolean isCurrentLowest = isLowestBid(auctionId, amount);

        // Build BidDTO with isCurrentLowest flag
        BidDTO bidDTO = BidDTO.builder()
                .id(savedBid.getId())
                .auctionId(savedBid.getAuctionId())
                .organizationId(savedBid.getOrganizationId())
                .organizationName(savedBid.getBidderName())
                .amount(savedBid.getBidAmount())
                .status(savedBid.getBidStatus())
                .createdAt(savedBid.getBidTime())
                .isCurrentLowest(isCurrentLowest)
                .build();

        // Notify realtime service to broadcast bid
        realtimeNotificationService.notifyBidSubmitted(bidDTO);

        return bidDTO;
    }

    /**
     * Accept a pending bid.
     * Requirements: 4.1, 4.2, 4.5
     */
    @Override
    @Transactional
    public BidDTO acceptBid(String auctionId, String bidId, String clientUserId) {
        log.info("Accepting bid: {} for auction: {}, clientUserId: {}", bidId, auctionId, clientUserId);

        // Validate bid exists
        AuctionBid bid = auctionBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found with ID: " + bidId));

        // Validate bid belongs to the auction
        if (!bid.getAuctionId().equals(auctionId)) {
            throw new InvalidBidException("Bid does not belong to the specified auction");
        }

        // Validate bid is in PENDING status
        if (bid.getBidStatus() != BidStatus.PENDING) {
            throw new InvalidBidException("Cannot accept bid. Current status: " + bid.getBidStatus() + 
                    ". Only PENDING bids can be accepted.");
        }

        // Find and update any existing ACCEPTED bid to PENDING
        Optional<AuctionBid> existingAcceptedBid = auctionBidRepository.findAcceptedBidForAuction(auctionId);
        if (existingAcceptedBid.isPresent()) {
            AuctionBid previousAccepted = existingAcceptedBid.get();
            previousAccepted.setBidStatus(BidStatus.PENDING);
            auctionBidRepository.save(previousAccepted);
            log.info("Updated previous accepted bid {} to PENDING", previousAccepted.getId());
        }

        // Update target bid to ACCEPTED
        bid.setBidStatus(BidStatus.ACCEPTED);
        AuctionBid updatedBid = auctionBidRepository.save(bid);

        log.info("Bid {} accepted successfully", bidId);

        // Build BidDTO
        BidDTO bidDTO = BidDTO.builder()
                .id(updatedBid.getId())
                .auctionId(updatedBid.getAuctionId())
                .organizationId(updatedBid.getOrganizationId())
                .organizationName(updatedBid.getBidderName())
                .amount(updatedBid.getBidAmount())
                .status(updatedBid.getBidStatus())
                .createdAt(updatedBid.getBidTime())
                .isCurrentLowest(true) // Accepted bid is considered current lowest
                .build();

        // Notify realtime service to broadcast acceptance
        realtimeNotificationService.notifyBidAccepted(bidDTO);

        return bidDTO;
    }

    /**
     * Reject a bid.
     * Requirements: 4.4
     */
    @Override
    @Transactional
    public BidDTO rejectBid(String auctionId, String bidId, String clientUserId) {
        log.info("Rejecting bid: {} for auction: {}, clientUserId: {}", bidId, auctionId, clientUserId);

        // Validate bid exists
        AuctionBid bid = auctionBidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found with ID: " + bidId));

        // Validate bid belongs to the auction
        if (!bid.getAuctionId().equals(auctionId)) {
            throw new InvalidBidException("Bid does not belong to the specified auction");
        }

        // Update bid status to REJECTED
        bid.setBidStatus(BidStatus.REJECTED);
        AuctionBid updatedBid = auctionBidRepository.save(bid);

        log.info("Bid {} rejected successfully", bidId);

        // Build BidDTO
        BidDTO bidDTO = BidDTO.builder()
                .id(updatedBid.getId())
                .auctionId(updatedBid.getAuctionId())
                .organizationId(updatedBid.getOrganizationId())
                .organizationName(updatedBid.getBidderName())
                .amount(updatedBid.getBidAmount())
                .status(updatedBid.getBidStatus())
                .createdAt(updatedBid.getBidTime())
                .isCurrentLowest(false)
                .build();

        // Notify realtime service to broadcast rejection
        realtimeNotificationService.notifyBidRejected(bidDTO);

        return bidDTO;
    }

    /**
     * Get the current live state of an auction for late joiners.
     * Requirements: 3.3, 8.1, 8.2, 8.3
     */
    @Override
    public LiveAuctionStateDTO getLiveState(String auctionId) {
        log.info("Getting live state for auction: {}", auctionId);

        // Find the auction
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found with ID: " + auctionId));

        // Query for current ACCEPTED bid
        Optional<AuctionBid> acceptedBidOpt = auctionBidRepository.findAcceptedBidForAuction(auctionId);
        BidDTO currentAcceptedBid = null;
        
        if (acceptedBidOpt.isPresent()) {
            AuctionBid acceptedBid = acceptedBidOpt.get();
            currentAcceptedBid = BidDTO.builder()
                    .id(acceptedBid.getId())
                    .auctionId(acceptedBid.getAuctionId())
                    .organizationId(acceptedBid.getOrganizationId())
                    .organizationName(acceptedBid.getBidderName())
                    .amount(acceptedBid.getBidAmount())
                    .status(acceptedBid.getBidStatus())
                    .createdAt(acceptedBid.getBidTime())
                    .isCurrentLowest(true)
                    .build();
        }

        // Query for last 5 bids ordered by created_at DESC
        List<AuctionBid> recentBidEntities = auctionBidRepository.findRecentBidsByAuctionId(auctionId, 5);
        List<BidDTO> recentBids = recentBidEntities.stream()
                .map(bid -> BidDTO.builder()
                        .id(bid.getId())
                        .auctionId(bid.getAuctionId())
                        .organizationId(bid.getOrganizationId())
                        .organizationName(bid.getBidderName())
                        .amount(bid.getBidAmount())
                        .status(bid.getBidStatus())
                        .createdAt(bid.getBidTime())
                        .isCurrentLowest(false) // Will be set based on comparison
                        .build())
                .collect(java.util.stream.Collectors.toList());

        // Calculate remaining time (end_time - current_time)
        Long remainingTimeMs = 0L;
        if (auction.getEndTime() != null) {
            long remaining = java.time.Duration.between(LocalDateTime.now(), auction.getEndTime()).toMillis();
            remainingTimeMs = remaining > 0 ? remaining : 0L;
        }

        // Calculate minimum next bid based on current lowest
        BigDecimal minimumNextBid = null;
        if (currentAcceptedBid != null) {
            minimumNextBid = bidValidator.calculateMinimumNextBid(currentAcceptedBid.getAmount());
        } else if (!recentBids.isEmpty()) {
            // If no accepted bid, use the lowest bid from recent bids
            BigDecimal lowestAmount = recentBids.stream()
                    .map(BidDTO::getAmount)
                    .min(BigDecimal::compareTo)
                    .orElse(null);
            if (lowestAmount != null) {
                minimumNextBid = bidValidator.calculateMinimumNextBid(lowestAmount);
            }
        }

        // Build and return LiveAuctionStateDTO
        LiveAuctionStateDTO liveState = LiveAuctionStateDTO.builder()
                .currentAcceptedBid(currentAcceptedBid)
                .recentBids(recentBids)
                .auctionStatus(auction.getStatus())
                .remainingTimeMs(remainingTimeMs)
                .minimumNextBid(minimumNextBid)
                .build();

        log.info("Live state retrieved for auction: {}, accepted bid: {}, recent bids: {}, remaining time: {}ms",
                auctionId, currentAcceptedBid != null, recentBids.size(), remainingTimeMs);

        return liveState;
    }

    /**
     * End an auction manually or automatically.
     * Requirements: 7.1, 7.2, 7.3, 7.5
     */
    @Override
    @Transactional
    public AuctionDetailResponse endAuction(String auctionId) {
        log.info("Ending auction: {}", auctionId);

        // Find the auction
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found with ID: " + auctionId));

        // Store old status for notification
        AuctionStatus oldStatus = auction.getStatus();

        // Update auction status to ENDED
        auction.setStatus(AuctionStatus.ENDED);
        auction.setClosedAt(LocalDateTime.now());

        // Query for most recent ACCEPTED bid
        Optional<AuctionBid> acceptedBidOpt = auctionBidRepository.findAcceptedBidForAuction(auctionId);

        if (acceptedBidOpt.isPresent()) {
            // If ACCEPTED bid exists, set winner_organization_id and winning_bid_amount
            AuctionBid winningBid = acceptedBidOpt.get();
            auction.setWinnerBidId(winningBid.getId());
            auction.setWinnerBidderId(winningBid.getOrganizationId());
            auction.setWinnerBidderName(winningBid.getBidderName());
            auction.setWinningBidAmount(winningBid.getBidAmount());
            
            log.info("Auction {} ended with winner: {} (Organization ID: {}), winning amount: {}",
                    auctionId, winningBid.getBidderName(), winningBid.getOrganizationId(), 
                    winningBid.getBidAmount());
        } else {
            // If no ACCEPTED bid, leave winner fields null
            auction.setWinnerBidId(null);
            auction.setWinnerBidderId(null);
            auction.setWinnerBidderName(null);
            auction.setWinningBidAmount(null);
            
            log.info("Auction {} ended with no winner (no accepted bids)", auctionId);
        }

        // Persist changes to database
        int updated = auctionRepository.update(auction);
        if (updated == 0) {
            throw new AuctionException("Failed to update auction status to ENDED");
        }

        log.info("Auction {} successfully ended", auctionId);

        // Notify realtime service to broadcast final status
        AuctionStatusChangeDTO statusChange = AuctionStatusChangeDTO.builder()
                .auctionId(auctionId)
                .oldStatus(oldStatus)
                .newStatus(AuctionStatus.ENDED)
                .timestamp(LocalDateTime.now())
                .build();
        
        realtimeNotificationService.notifyAuctionStatusChange(statusChange);

        // Build and return response
        return buildAuctionDetailResponse(auction);
    }

    /**
     * Helper method to determine if a bid amount is the current lowest for an auction.
     * In a reverse auction, lower bids are better.
     */
    private boolean isLowestBid(String auctionId, BigDecimal amount) {
        List<AuctionBid> allBids = auctionBidRepository.findByAuctionIdOrderByAmountDesc(auctionId);
        
        if (allBids.isEmpty()) {
            return true; // First bid is always the lowest
        }

        // Find the minimum bid amount (for reverse auction)
        BigDecimal currentLowest = allBids.stream()
                .map(AuctionBid::getBidAmount)
                .min(BigDecimal::compareTo)
                .orElse(null);

        return currentLowest == null || amount.compareTo(currentLowest) < 0;
    }

    /**
     * Helper method to build AuctionDetailResponse from Auction entity.
     */
    private AuctionDetailResponse buildAuctionDetailResponse(Auction auction) {
        AuctionDetailResponse response = new AuctionDetailResponse();
        response.setId(auction.getId());
        response.setProjectId(auction.getProjectId());
        response.setProjectTitle(auction.getProjectTitle());
        response.setProjectCategory(auction.getProjectCategory());
        response.setStartTime(auction.getStartTime());
        response.setEndTime(auction.getEndTime());
        response.setStatus(auction.getStatus());
        response.setCurrentHighestBid(auction.getCurrentHighestBid());
        response.setCurrentHighestBidderName(auction.getCurrentHighestBidderName());
        response.setMinimumBidIncrement(auction.getMinimumBidIncrement());
        response.setReservePrice(auction.getReservePrice());
        response.setTotalBids(auction.getTotalBids());
        
        // Calculate time remaining
        if (auction.getEndTime() != null) {
            long timeRemaining = java.time.Duration.between(LocalDateTime.now(), auction.getEndTime()).toMillis();
            response.setTimeRemaining(timeRemaining > 0 ? timeRemaining : 0L);
        }
        
        return response;
    }
}
