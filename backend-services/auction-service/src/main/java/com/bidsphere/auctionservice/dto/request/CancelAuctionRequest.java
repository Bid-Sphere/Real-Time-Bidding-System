package com.bidsphere.auctionservice.dto.request;

import lombok.Data;

@Data
public class CancelAuctionRequest {

    private String reason;

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}