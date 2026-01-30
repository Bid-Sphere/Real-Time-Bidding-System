package com.bidsphere.auctionservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionBid
{

    private String id;
    private String auctionId;
    private String bidderId;
    private String bidderName;
    private BigDecimal bidAmount;
    private String proposal;
    private Boolean isWinning;
    private LocalDateTime bidTime;
    private String organizationId;
}