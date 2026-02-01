package com.bidsphere.auctionservice.dto.response;

import com.bidsphere.auctionservice.constant.AuctionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO representing the current state of a live auction.
 * Used for late joiners to get the complete auction state.
 * 
 * Requirements: 8.1, 8.2, 8.3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveAuctionStateDTO {
    
    /**
     * The current accepted bid (winning bid).
     * Null if no bid has been accepted yet.
     */
    private BidDTO currentAcceptedBid;
    
    /**
     * The last 5 bids in chronological order (most recent first).
     */
    private List<BidDTO> recentBids;
    
    /**
     * The current status of the auction.
     */
    private AuctionStatus auctionStatus;
    
    /**
     * Remaining time until auction end in milliseconds.
     * 0 if auction has ended.
     */
    private Long remainingTimeMs;
    
    /**
     * The minimum next bid amount based on current lowest bid.
     * Null if no bids exist yet.
     */
    private BigDecimal minimumNextBid;
}
