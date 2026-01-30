package com.bidsphere.auctionservice.model;

import com.bidsphere.auctionservice.constant.AuctionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Auction
{
    private String id;
    private String projectId;
    private String projectTitle;
    private String projectOwnerId;
    private String projectCategory;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private AuctionStatus status;
    private BigDecimal currentHighestBid;
    private String currentHighestBidderId;
    private String currentHighestBidderName;
    private BigDecimal minimumBidIncrement;
    private BigDecimal reservePrice;
    private Integer totalBids;
    private String winnerBidId;
    private String winnerBidderId;
    private String winnerBidderName;
    private BigDecimal winningBidAmount;
    private LocalDateTime closedAt;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}