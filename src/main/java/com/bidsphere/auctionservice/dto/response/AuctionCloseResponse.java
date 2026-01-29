package com.bidsphere.auctionservice.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AuctionCloseResponse {

    private String id;
    private String status;
    private String winnerBidId;
    private String winnerBidderId;
    private String winnerBidderName;
    private BigDecimal winningBidAmount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime closedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getWinnerBidId() {
        return winnerBidId;
    }

    public void setWinnerBidId(String winnerBidId) {
        this.winnerBidId = winnerBidId;
    }

    public String getWinnerBidderId() {
        return winnerBidderId;
    }

    public void setWinnerBidderId(String winnerBidderId) {
        this.winnerBidderId = winnerBidderId;
    }

    public String getWinnerBidderName() {
        return winnerBidderName;
    }

    public void setWinnerBidderName(String winnerBidderName) {
        this.winnerBidderName = winnerBidderName;
    }

    public BigDecimal getWinningBidAmount() {
        return winningBidAmount;
    }

    public void setWinningBidAmount(BigDecimal winningBidAmount) {
        this.winningBidAmount = winningBidAmount;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }
}