package com.biddingsystem.bidding.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidStatsResponse {
    
    private Long totalBids;
    private Long pendingBids;
    private Long acceptedBids;
    private Long rejectedBids;
    private BigDecimal averageBidAmount;
    private BigDecimal lowestBid;
    private BigDecimal highestBid;
}
