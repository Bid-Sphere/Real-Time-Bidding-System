package com.bidsphere.auctionservice.service.impl;

import com.bidsphere.auctionservice.constant.AppConstants;
import com.bidsphere.auctionservice.constant.AuctionStatus;
import com.bidsphere.auctionservice.dto.request.CreateAuctionRequest;
import com.bidsphere.auctionservice.dto.request.SubmitAuctionBidRequest;
import com.bidsphere.auctionservice.dto.request.CancelAuctionRequest;
import com.bidsphere.auctionservice.dto.response.*;
import com.bidsphere.auctionservice.exception.AuctionException;
import com.bidsphere.auctionservice.exception.ResourceNotFoundException;
import com.bidsphere.auctionservice.model.Auction;
import com.bidsphere.auctionservice.model.AuctionBid;
import com.bidsphere.auctionservice.repository.interfaces.AuctionRepository;
import com.bidsphere.auctionservice.repository.interfaces.AuctionBidRepository;
import com.bidsphere.auctionservice.service.interfaces.AuctionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AuctionServiceImpl implements AuctionService
{

    private static final Logger log = LoggerFactory.getLogger(AuctionServiceImpl.class);

    private final AuctionRepository auctionRepository;
    private final AuctionBidRepository auctionBidRepository;
    private final ProjectServiceClient projectServiceClient;

    @Value("${app.auction.default-min-bid-increment:100.00}")
    private String defaultMinBidIncrement;

    public AuctionServiceImpl(AuctionRepository auctionRepository, 
                             AuctionBidRepository auctionBidRepository,
                             ProjectServiceClient projectServiceClient) {
        this.auctionRepository = auctionRepository;
        this.auctionBidRepository = auctionBidRepository;
        this.projectServiceClient = projectServiceClient;
    }

    @Override
    @Transactional
    public AuctionDetailResponse createAuction(CreateAuctionRequest request) {
        log.info("Creating auction for project: {}", request.getProjectId());

        validateCreateAuctionRequest(request);

        if (auctionRepository.existsByProjectId(request.getProjectId())) {
            throw new AuctionException("Auction already exists for this project");
        }

        Auction auction = new Auction();
        auction.setProjectId(request.getProjectId());
        auction.setProjectTitle(request.getProjectTitle());
        auction.setProjectOwnerId(request.getProjectOwnerId());
        auction.setProjectCategory(request.getProjectCategory());
        auction.setStartTime(request.getStartTime());
        auction.setEndTime(request.getEndTime());
        auction.setStatus(AuctionStatus.SCHEDULED);
        auction.setMinimumBidIncrement(request.getMinimumBidIncrement() != null
                ? request.getMinimumBidIncrement()
                : new BigDecimal(defaultMinBidIncrement));
        auction.setReservePrice(request.getReservePrice());
        auction.setTotalBids(0);
        auction.setCreatedAt(LocalDateTime.now());
        auction.setUpdatedAt(LocalDateTime.now());

        Auction savedAuction = auctionRepository.save(auction);
        log.info("Auction created successfully with ID: {}", savedAuction.getId());

        return mapToAuctionDetailResponse(savedAuction);
    }

    @Override
    public AuctionDetailResponse getAuctionByProjectId(String projectId) {
        log.info("Getting auction for project ID: {}", projectId);

        Auction auction = auctionRepository.findByProjectId(projectId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        AppConstants.AUCTION_NOT_FOUND + " for project: " + projectId));

        return mapToAuctionDetailResponse(auction);
    }

    @Override
    public AuctionDetailResponse getAuctionById(String auctionId) {
        log.info("Getting auction by ID: {}", auctionId);

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        AppConstants.AUCTION_NOT_FOUND + " with ID: " + auctionId));

        return mapToAuctionDetailResponse(auction);
    }

    @Override
    public ActiveAuctionsResponse getActiveAuctions(int page, int limit) {
        log.info("Getting active auctions, page: {}, limit: {}", page, limit);

        validatePageAndLimit(page, limit);

        int offset = page * limit;
        List<Auction> auctions = auctionRepository.findActiveAuctions(limit, offset);
        int totalAuctions = auctionRepository.countActiveAuctions();
        int totalPages = (int) Math.ceil((double) totalAuctions / limit);

        ActiveAuctionsResponse response = new ActiveAuctionsResponse();
        response.setContent(mapToActiveAuctions(auctions));
        response.setTotalElements(totalAuctions);
        response.setTotalPages(totalPages);
        response.setCurrentPage(page);

        log.info("Found {} active auctions", auctions.size());
        return response;
    }

    @Override
    public ActiveAuctionsResponse getMyAuctions(String clientUserId, int page, int limit) {
        log.info("Getting auctions for client: {}, page: {}, limit: {}", clientUserId, page, limit);

        validatePageAndLimit(page, limit);

        int offset = page * limit;
        List<Auction> auctions = auctionRepository.findByClientUserId(clientUserId, limit, offset);
        int totalAuctions = auctionRepository.countByClientUserId(clientUserId);
        int totalPages = (int) Math.ceil((double) totalAuctions / limit);

        ActiveAuctionsResponse response = new ActiveAuctionsResponse();
        response.setContent(mapToActiveAuctions(auctions));
        response.setTotalElements(totalAuctions);
        response.setTotalPages(totalPages);
        response.setCurrentPage(page);

        log.info("Found {} auctions for client: {}", auctions.size(), clientUserId);
        return response;
    }

    @Override
    @Transactional
    public AuctionBidResponse submitBid(String auctionId, SubmitAuctionBidRequest request,
                                        String bidderId, String bidderName, String organizationId) {
        log.info("Submitting bid for auction: {}, bidder: {}, amount: {}",
                auctionId, bidderName, request.getBidAmount());

        validateSubmitBidRequest(request);

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        AppConstants.AUCTION_NOT_FOUND + " with ID: " + auctionId));

        validateAuctionForBidding(auction, bidderId, request.getBidAmount());

        AuctionBid bid = new AuctionBid();
        bid.setAuctionId(auctionId);
        bid.setBidderId(bidderId);
        bid.setBidderName(bidderName);
        bid.setBidAmount(request.getBidAmount());
        bid.setProposal(request.getProposal());
        bid.setIsWinning(false);
        bid.setBidTime(LocalDateTime.now());
        bid.setOrganizationId(organizationId);
        bid.setBidStatus(com.bidsphere.auctionservice.constant.BidStatus.PENDING);

        AuctionBid savedBid = auctionBidRepository.save(bid);

        auction.setCurrentHighestBid(request.getBidAmount());
        auction.setCurrentHighestBidderId(bidderId);
        auction.setCurrentHighestBidderName(bidderName);
        auction.setTotalBids(auction.getTotalBids() + 1);
        auction.setUpdatedAt(LocalDateTime.now());

        auctionRepository.update(auction);

        AuctionBidResponse response = mapToAuctionBidResponse(savedBid);
        response.setNextMinimumBid(calculateNextMinimumBid(auction));

        log.info("Bid submitted successfully with ID: {}", savedBid.getId());
        return response;
    }

    @Override
    public AuctionBidsResponse getAuctionBids(String auctionId, int page, int limit) {
        log.info("Getting bids for auction: {}, page: {}, limit: {}", auctionId, page, limit);

        validatePageAndLimit(page, limit);

        if (!auctionRepository.findById(auctionId).isPresent()) {
            throw new ResourceNotFoundException(AppConstants.AUCTION_NOT_FOUND + " with ID: " + auctionId);
        }

        int offset = page * limit;
        List<AuctionBid> bids = auctionBidRepository.findByAuctionId(auctionId, limit, offset);
        int totalBids = auctionBidRepository.countByAuctionId(auctionId);
        int totalPages = (int) Math.ceil((double) totalBids / limit);

        AuctionBidsResponse response = new AuctionBidsResponse();
        response.setContent(mapToAuctionBidDetails(bids));
        response.setTotalElements(totalBids);
        response.setTotalPages(totalPages);
        response.setCurrentPage(page);

        log.info("Found {} bids for auction {}", bids.size(), auctionId);
        return response;
    }

    @Override
    @Transactional
    public AuctionCloseResponse closeAuction(String auctionId) {
        log.info("Closing auction: {}", auctionId);

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        AppConstants.AUCTION_NOT_FOUND + " with ID: " + auctionId));

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new AuctionException("Only active auctions can be closed");
        }

        auction.setStatus(AuctionStatus.ENDED);
        auction.setClosedAt(LocalDateTime.now());
        auction.setUpdatedAt(LocalDateTime.now());

        // For reverse auction, find the LOWEST ACCEPTED bid
        AuctionBid lowestAcceptedBid = auctionBidRepository.findLowestBidForAuction(auctionId).orElse(null);

        if (lowestAcceptedBid != null) {
            auctionBidRepository.updateWinningStatus(lowestAcceptedBid.getId(), true);

            auction.setWinnerBidId(lowestAcceptedBid.getId());
            auction.setWinnerBidderId(lowestAcceptedBid.getBidderId());
            auction.setWinnerBidderName(lowestAcceptedBid.getBidderName());
            auction.setWinningBidAmount(lowestAcceptedBid.getBidAmount());

            log.info("Auction {} closed with winner: {} (lowest accepted bid: {})", 
                    auctionId, lowestAcceptedBid.getBidderName(), lowestAcceptedBid.getBidAmount());
        } else {
            log.info("Auction {} closed with no accepted bids", auctionId);
        }

        auctionRepository.update(auction);
        
        // Update project service if there's a winner
        if (lowestAcceptedBid != null) {
            projectServiceClient.updateProjectAfterAuction(
                auction.getProjectId(),
                lowestAcceptedBid.getId(),
                lowestAcceptedBid.getOrganizationId(),
                lowestAcceptedBid.getBidAmount(),
                auction.getTotalBids(),
                lowestAcceptedBid.getBidderEmail(),
                lowestAcceptedBid.getBidderName()
            );
        }

        return mapToAuctionCloseResponse(auction);
    }

    @Override
    @Transactional
    public BaseResponse<Void> cancelAuction(String auctionId, CancelAuctionRequest request, String userId) {
        log.info("Cancelling auction: {}, requested by user: {}", auctionId, userId);

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        AppConstants.AUCTION_NOT_FOUND + " with ID: " + auctionId));

        if (!auction.getProjectOwnerId().equals(userId)) {
            throw new AuctionException(AppConstants.INSUFFICIENT_PERMISSION);
        }

        if (auction.getStatus() == AuctionStatus.ENDED || auction.getStatus() == AuctionStatus.CANCELLED) {
            throw new AuctionException("Auction cannot be cancelled in its current state");
        }

        auction.setStatus(AuctionStatus.CANCELLED);
        auction.setCancelledAt(LocalDateTime.now());
        auction.setCancellationReason(request.getReason());
        auction.setUpdatedAt(LocalDateTime.now());

        auctionRepository.update(auction);

        log.info("Auction {} cancelled by user {}", auctionId, userId);
        return BaseResponse.success(AppConstants.AUCTION_CANCELLED, null);
    }

    @Override
    public MyAuctionBidsResponse getMyAuctionBids(String organizationId, String status, int page, int limit) {
        log.info("Getting bids for organization: {}, status: {}, page: {}, limit: {}",
                organizationId, status, page, limit);

        validatePageAndLimit(page, limit);

        int offset = page * limit;
        List<AuctionBid> bids = auctionBidRepository.findByOrganizationId(organizationId, limit, offset);

        List<MyAuctionBidsResponse.MyAuctionBid> myBids = new ArrayList<>();

        for (AuctionBid bid : bids) {
            Auction auction = auctionRepository.findById(bid.getAuctionId()).orElse(null);

            if (auction != null && (status == null || auction.getStatus().name().equals(status))) {
                MyAuctionBidsResponse.MyAuctionBid myBid = new MyAuctionBidsResponse.MyAuctionBid();
                myBid.setAuctionId(bid.getAuctionId());
                myBid.setProjectId(auction.getProjectId());
                myBid.setProjectTitle(auction.getProjectTitle());
                myBid.setMyHighestBid(bid.getBidAmount());
                myBid.setCurrentHighestBid(auction.getCurrentHighestBid());
                
                // Use is_winning flag from database (maintained by trigger)
                myBid.setIsWinning(bid.getIsWinning());
                
                myBid.setAuctionStatus(auction.getStatus().name());
                myBid.setEndTime(auction.getEndTime());
                myBid.setTimeRemaining(calculateTimeRemaining(auction));

                myBids.add(myBid);
            }
        }

        MyAuctionBidsResponse response = new MyAuctionBidsResponse();
        response.setContent(myBids);
        response.setTotalElements(myBids.size());
        response.setTotalPages((int) Math.ceil((double) myBids.size() / limit));

        log.info("Found {} bids for organization {}", myBids.size(), organizationId);
        return response;
    }

    @Override
    public AuctionStatsResponse getAuctionStats(String auctionId) {
        log.info("Getting statistics for auction: {}", auctionId);

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        AppConstants.AUCTION_NOT_FOUND + " with ID: " + auctionId));

        AuctionStatsResponse response = new AuctionStatsResponse();
        response.setTotalBids(auction.getTotalBids());
        response.setUniqueBidders(auctionBidRepository.countUniqueBiddersForAuction(auctionId));
        response.setCurrentHighestBid(auction.getCurrentHighestBid());
        response.setAverageBidAmount(BigDecimal.valueOf(
                auctionBidRepository.calculateAverageBidForAuction(auctionId)));
        response.setTimeRemaining(calculateTimeRemaining(auction));

        log.info("Statistics retrieved for auction {}", auctionId);
        return response;
    }

    @Override
    @Scheduled(cron = "${app.auction.scheduler.cron}")
    public void processScheduledAuctions() {
        log.info("Processing scheduled auctions");

        // Start scheduled auctions
        List<Auction> auctionsToStart = auctionRepository.findAuctionsToStart();
        for (Auction auction : auctionsToStart) {
            try {
                auctionRepository.updateStatus(auction.getId(), AuctionStatus.ACTIVE.name());
                log.info("Started auction: {}", auction.getId());
            } catch (Exception e) {
                log.error("Failed to start auction {}: {}", auction.getId(), e.getMessage());
            }
        }

        // Close expired auctions
        closeExpiredAuctions();
    }

    @Override
    public void closeExpiredAuctions() {
        log.info("Closing expired auctions");

        List<Auction> auctionsToClose = auctionRepository.findAuctionsToClose();
        for (Auction auction : auctionsToClose) {
            try {
                closeAuction(auction.getId());
                log.info("Auto-closed auction: {}", auction.getId());
            } catch (Exception e) {
                log.error("Failed to auto-close auction {}: {}", auction.getId(), e.getMessage());
            }
        }
    }

    // Helper Methods
    private void validateCreateAuctionRequest(CreateAuctionRequest request) {
        if (request.getProjectId() == null || request.getProjectId().trim().isEmpty()) {
            throw new IllegalArgumentException(AppConstants.PROJECT_ID_REQUIRED);
        }
        if (request.getStartTime() == null) {
            throw new IllegalArgumentException(AppConstants.START_TIME_REQUIRED);
        }
        if (request.getEndTime() == null) {
            throw new IllegalArgumentException(AppConstants.END_TIME_REQUIRED);
        }
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }

    private void validateSubmitBidRequest(SubmitAuctionBidRequest request) {
        if (request.getBidAmount() == null) {
            throw new IllegalArgumentException(AppConstants.BID_AMOUNT_REQUIRED);
        }
        if (request.getBidAmount().compareTo(BigDecimal.valueOf(AppConstants.MIN_BID_AMOUNT)) < 0) {
            throw new IllegalArgumentException("Bid amount must be at least " + AppConstants.MIN_BID_AMOUNT);
        }
        if (request.getProposal() == null || request.getProposal().trim().isEmpty()) {
            throw new IllegalArgumentException(AppConstants.PROPOSAL_REQUIRED);
        }
        if (request.getProposal().length() < AppConstants.MIN_PROPOSAL_LENGTH) {
            throw new IllegalArgumentException("Proposal must be at least " +
                    AppConstants.MIN_PROPOSAL_LENGTH + " characters");
        }
    }

    private void validateAuctionForBidding(Auction auction, String bidderId, BigDecimal bidAmount) {
        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new AuctionException(AppConstants.AUCTION_NOT_ACTIVE);
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(auction.getStartTime())) {
            throw new AuctionException(AppConstants.AUCTION_NOT_STARTED);
        }

        if (now.isAfter(auction.getEndTime())) {
            throw new AuctionException(AppConstants.AUCTION_ALREADY_ENDED);
        }

        BigDecimal nextMinimumBid = calculateNextMinimumBid(auction);
        if (bidAmount.compareTo(nextMinimumBid) < 0) {
            throw new AuctionException(AppConstants.BID_TOO_LOW);
        }

        if (auction.getCurrentHighestBidderId() != null &&
                auction.getCurrentHighestBidderId().equals(bidderId)) {
            throw new AuctionException(AppConstants.BIDDER_IS_HIGHEST);
        }
    }

    private void validatePageAndLimit(int page, int limit) {
        if (page < 0) {
            throw new IllegalArgumentException("Page must be >= 0");
        }
        if (limit < 1 || limit > AppConstants.MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("Limit must be between 1 and " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    private BigDecimal calculateNextMinimumBid(Auction auction) {
        BigDecimal currentBid = auction.getCurrentHighestBid() != null
                ? auction.getCurrentHighestBid()
                : BigDecimal.ZERO;
        return currentBid.add(auction.getMinimumBidIncrement());
    }

    private Long calculateTimeRemaining(Auction auction) {
        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            return 0L;
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(auction.getEndTime())) {
            return 0L;
        }
        return Duration.between(now, auction.getEndTime()).getSeconds();
    }

    // Mapping Methods
    private AuctionDetailResponse mapToAuctionDetailResponse(Auction auction) {
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
        response.setTimeRemaining(calculateTimeRemaining(auction));
        response.setNextMinimumBid(calculateNextMinimumBid(auction));
        response.setWinningBidAmount(auction.getWinningBidAmount());
        
        // Calculate current lowest bid (for reverse auction)
        if (auction.getStatus() == AuctionStatus.ACTIVE || auction.getStatus() == AuctionStatus.SCHEDULED) {
            // Get the lowest bid from all bids
            AuctionBid lowestBid = auctionBidRepository.findLowestBidForAuction(auction.getId()).orElse(null);
            if (lowestBid != null) {
                response.setCurrentLowestBid(lowestBid.getBidAmount());
            }
        } else if (auction.getStatus() == AuctionStatus.ENDED) {
            // For ended auctions, show the winning bid as the lowest
            response.setCurrentLowestBid(auction.getWinningBidAmount());
        }
        
        return response;
    }

    private List<ActiveAuctionsResponse.ActiveAuction> mapToActiveAuctions(List<Auction> auctions) {
        List<ActiveAuctionsResponse.ActiveAuction> activeAuctions = new ArrayList<>();

        for (Auction auction : auctions) {
            ActiveAuctionsResponse.ActiveAuction activeAuction = new ActiveAuctionsResponse.ActiveAuction();
            activeAuction.setId(auction.getId());
            activeAuction.setProjectId(auction.getProjectId());
            activeAuction.setProjectTitle(auction.getProjectTitle());
            activeAuction.setProjectCategory(auction.getProjectCategory());
            activeAuction.setStartTime(auction.getStartTime());
            activeAuction.setEndTime(auction.getEndTime());
            activeAuction.setCreatedAt(auction.getCreatedAt());
            activeAuction.setStatus(auction.getStatus());
            activeAuction.setCurrentHighestBid(auction.getCurrentHighestBid());
            activeAuction.setTotalBids(auction.getTotalBids());
            activeAuction.setTimeRemaining(calculateTimeRemaining(auction));
            activeAuction.setReservePrice(auction.getReservePrice());
            activeAuction.setWinningBidAmount(auction.getWinningBidAmount());

            activeAuctions.add(activeAuction);
        }

        return activeAuctions;
    }

    private AuctionBidResponse mapToAuctionBidResponse(AuctionBid bid) {
        AuctionBidResponse response = new AuctionBidResponse();
        response.setId(bid.getId());
        response.setAuctionId(bid.getAuctionId());
        response.setBidAmount(bid.getBidAmount());
        response.setBidderName(bid.getBidderName());
        response.setBidTime(bid.getBidTime());
        response.setIsWinning(bid.getIsWinning());
        return response;
    }

    private List<AuctionBidsResponse.AuctionBidDetail> mapToAuctionBidDetails(List<AuctionBid> bids) {
        List<AuctionBidsResponse.AuctionBidDetail> bidDetails = new ArrayList<>();

        for (AuctionBid bid : bids) {
            AuctionBidsResponse.AuctionBidDetail detail = new AuctionBidsResponse.AuctionBidDetail();
            detail.setId(bid.getId());
            detail.setBidderName(bid.getBidderName());
            detail.setBidAmount(bid.getBidAmount());
            detail.setBidTime(bid.getBidTime());
            detail.setIsWinning(bid.getIsWinning());
            detail.setBidStatus(bid.getBidStatus());

            bidDetails.add(detail);
        }

        return bidDetails;
    }

    private AuctionCloseResponse mapToAuctionCloseResponse(Auction auction) {
        AuctionCloseResponse response = new AuctionCloseResponse();
        response.setId(auction.getId());
        response.setStatus(auction.getStatus().name());
        response.setWinnerBidId(auction.getWinnerBidId());
        response.setWinnerBidderId(auction.getWinnerBidderId());
        response.setWinnerBidderName(auction.getWinnerBidderName());
        response.setWinningBidAmount(auction.getWinningBidAmount());
        response.setClosedAt(auction.getClosedAt());
        return response;
    }
}