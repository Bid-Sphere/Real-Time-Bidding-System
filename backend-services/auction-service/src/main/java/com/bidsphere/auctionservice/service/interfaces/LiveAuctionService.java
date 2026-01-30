package com.bidsphere.auctionservice.service.interfaces;

import com.bidsphere.auctionservice.dto.response.AuctionDetailResponse;
import com.bidsphere.auctionservice.dto.response.BidDTO;
import com.bidsphere.auctionservice.dto.response.LiveAuctionStateDTO;

import java.math.BigDecimal;

/**
 * Service interface for live auction operations including real-time bidding.
 */
public interface LiveAuctionService {

    /**
     * Transition an auction from SCHEDULED to LIVE status.
     * 
     * @param auctionId The ID of the auction to start
     * @param clientUserId The ID of the client starting the auction
     * @return The updated auction details
     */
    AuctionDetailResponse goLive(String auctionId, String clientUserId);

    /**
     * Submit a new bid to a live auction.
     * 
     * @param auctionId The ID of the auction
     * @param organizationId The ID of the organization submitting the bid
     * @param organizationName The name of the organization
     * @param amount The bid amount
     * @return The created bid DTO
     */
    BidDTO submitBid(String auctionId, String organizationId, String organizationName, BigDecimal amount);

    /**
     * Accept a pending bid.
     * 
     * @param auctionId The ID of the auction
     * @param bidId The ID of the bid to accept
     * @param clientUserId The ID of the client accepting the bid
     * @return The updated bid DTO
     */
    BidDTO acceptBid(String auctionId, String bidId, String clientUserId);

    /**
     * Reject a bid.
     * 
     * @param auctionId The ID of the auction
     * @param bidId The ID of the bid to reject
     * @param clientUserId The ID of the client rejecting the bid
     * @return The updated bid DTO
     */
    BidDTO rejectBid(String auctionId, String bidId, String clientUserId);

    /**
     * Get the current live state of an auction for late joiners.
     * 
     * @param auctionId The ID of the auction
     * @return The live auction state including current accepted bid, recent bids, and remaining time
     */
    LiveAuctionStateDTO getLiveState(String auctionId);

    /**
     * End an auction manually or automatically.
     * 
     * @param auctionId The ID of the auction to end
     * @return The updated auction details with winner information
     */
    AuctionDetailResponse endAuction(String auctionId);
}
