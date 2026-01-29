package com.bidsphere.auctionservice.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AuctionBidResponse {

    private String id;
    private String auctionId;
    private BigDecimal bidAmount;
    private String bidderName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime bidTime;

    private Boolean isWinning;
    private BigDecimal nextMinimumBid;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAuctionId() {
        return auctionId;
    }

    public void setAuctionId(String auctionId) {
        this.auctionId = auctionId;
    }

    public BigDecimal getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(BigDecimal bidAmount) {
        this.bidAmount = bidAmount;
    }

    public String getBidderName() {
        return bidderName;
    }

    public void setBidderName(String bidderName) {
        this.bidderName = bidderName;
    }

    public LocalDateTime getBidTime() {
        return bidTime;
    }

    public void setBidTime(LocalDateTime bidTime) {
        this.bidTime = bidTime;
    }

    public Boolean getIsWinning() {
        return isWinning;
    }

    public void setIsWinning(Boolean isWinning) {
        this.isWinning = isWinning;
    }

    public BigDecimal getNextMinimumBid() {
        return nextMinimumBid;
    }

    public void setNextMinimumBid(BigDecimal nextMinimumBid) {
        this.nextMinimumBid = nextMinimumBid;
    }
}