package com.bidsphere.auctionservice.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SubmitAuctionBidRequest {

    private BigDecimal bidAmount;
    private String proposal;

    public BigDecimal getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(BigDecimal bidAmount) {
        this.bidAmount = bidAmount;
    }

    public String getProposal() {
        return proposal;
    }

    public void setProposal(String proposal) {
        this.proposal = proposal;
    }
}