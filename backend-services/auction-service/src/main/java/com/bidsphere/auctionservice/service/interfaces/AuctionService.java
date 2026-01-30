package com.bidsphere.auctionservice.service.interfaces;

import com.bidsphere.auctionservice.dto.request.CreateAuctionRequest;
import com.bidsphere.auctionservice.dto.request.SubmitAuctionBidRequest;
import com.bidsphere.auctionservice.dto.request.CancelAuctionRequest;
import com.bidsphere.auctionservice.dto.response.*;

public interface AuctionService
{

    // Auction Management
    AuctionDetailResponse createAuction(CreateAuctionRequest request);
    AuctionDetailResponse getAuctionByProjectId(String projectId);
    AuctionDetailResponse getAuctionById(String auctionId);
    ActiveAuctionsResponse getActiveAuctions(int page, int limit);
    ActiveAuctionsResponse getMyAuctions(String clientUserId, int page, int limit);
    AuctionCloseResponse closeAuction(String auctionId);
    BaseResponse<Void> cancelAuction(String auctionId, CancelAuctionRequest request, String userId);

    // Bidding
    AuctionBidResponse submitBid(String auctionId, SubmitAuctionBidRequest request,
                                 String bidderId, String bidderName, String organizationId);
    AuctionBidsResponse getAuctionBids(String auctionId, int page, int limit);
    MyAuctionBidsResponse getMyAuctionBids(String organizationId, String status, int page, int limit);

    // Statistics
    AuctionStatsResponse getAuctionStats(String auctionId);

    // Scheduler
    void processScheduledAuctions();
    void closeExpiredAuctions();
}