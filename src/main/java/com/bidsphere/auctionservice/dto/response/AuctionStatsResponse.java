package com.bidsphere.auctionservice.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AuctionStatsResponse {

    private Integer totalBids;
    private Integer uniqueBidders;
    private BigDecimal currentHighestBid;
    private BigDecimal averageBidAmount;
    private BigDecimal bidIncreaseRate;
    private Long timeRemaining;

    public Integer getTotalBids() {
        return totalBids;
    }

    public void setTotalBids(Integer totalBids) {
        this.totalBids = totalBids;
    }

    public Integer getUniqueBidders() {
        return uniqueBidders;
    }

    public void setUniqueBidders(Integer uniqueBidders) {
        this.uniqueBidders = uniqueBidders;
    }

    public BigDecimal getCurrentHighestBid() {
        return currentHighestBid;
    }

    public void setCurrentHighestBid(BigDecimal currentHighestBid) {
        this.currentHighestBid = currentHighestBid;
    }

    public BigDecimal getAverageBidAmount() {
        return averageBidAmount;
    }

    public void setAverageBidAmount(BigDecimal averageBidAmount) {
        this.averageBidAmount = averageBidAmount;
    }

    public BigDecimal getBidIncreaseRate() {
        return bidIncreaseRate;
    }

    public void setBidIncreaseRate(BigDecimal bidIncreaseRate) {
        this.bidIncreaseRate = bidIncreaseRate;
    }

    public Long getTimeRemaining() {
        return timeRemaining;
    }

    public void setTimeRemaining(Long timeRemaining) {
        this.timeRemaining = timeRemaining;
    }
}