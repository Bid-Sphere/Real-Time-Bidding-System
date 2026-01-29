package com.bidsphere.auctionservice.dto.response;

import com.bidsphere.auctionservice.constant.AuctionStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AuctionDetailResponse {

    private String id;
    private String projectId;
    private String projectTitle;
    private String projectCategory;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;

    private AuctionStatus status;
    private BigDecimal currentHighestBid;
    private String currentHighestBidderName;
    private BigDecimal minimumBidIncrement;
    private BigDecimal reservePrice;
    private Integer totalBids;
    private Long timeRemaining;
    private BigDecimal nextMinimumBid;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getProjectCategory() {
        return projectCategory;
    }

    public void setProjectCategory(String projectCategory) {
        this.projectCategory = projectCategory;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public AuctionStatus getStatus() {
        return status;
    }

    public void setStatus(AuctionStatus status) {
        this.status = status;
    }

    public BigDecimal getCurrentHighestBid() {
        return currentHighestBid;
    }

    public void setCurrentHighestBid(BigDecimal currentHighestBid) {
        this.currentHighestBid = currentHighestBid;
    }

    public String getCurrentHighestBidderName() {
        return currentHighestBidderName;
    }

    public void setCurrentHighestBidderName(String currentHighestBidderName) {
        this.currentHighestBidderName = currentHighestBidderName;
    }

    public BigDecimal getMinimumBidIncrement() {
        return minimumBidIncrement;
    }

    public void setMinimumBidIncrement(BigDecimal minimumBidIncrement) {
        this.minimumBidIncrement = minimumBidIncrement;
    }

    public BigDecimal getReservePrice() {
        return reservePrice;
    }

    public void setReservePrice(BigDecimal reservePrice) {
        this.reservePrice = reservePrice;
    }

    public Integer getTotalBids() {
        return totalBids;
    }

    public void setTotalBids(Integer totalBids) {
        this.totalBids = totalBids;
    }

    public Long getTimeRemaining() {
        return timeRemaining;
    }

    public void setTimeRemaining(Long timeRemaining) {
        this.timeRemaining = timeRemaining;
    }

    public BigDecimal getNextMinimumBid() {
        return nextMinimumBid;
    }

    public void setNextMinimumBid(BigDecimal nextMinimumBid) {
        this.nextMinimumBid = nextMinimumBid;
    }
}