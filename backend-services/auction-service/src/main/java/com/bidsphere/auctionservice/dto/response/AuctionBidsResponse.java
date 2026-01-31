package com.bidsphere.auctionservice.dto.response;

import com.bidsphere.auctionservice.constant.BidStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AuctionBidsResponse {

    private List<AuctionBidDetail> content;
    private long totalElements;
    private int totalPages;
    private int currentPage;

    @Data
    public static class AuctionBidDetail {
        private String id;
        private String bidderName;
        private BigDecimal bidAmount;

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime bidTime;

        private Boolean isWinning;
        private BidStatus bidStatus;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getBidderName() {
            return bidderName;
        }

        public void setBidderName(String bidderName) {
            this.bidderName = bidderName;
        }

        public BigDecimal getBidAmount() {
            return bidAmount;
        }

        public void setBidAmount(BigDecimal bidAmount) {
            this.bidAmount = bidAmount;
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

        public BidStatus getBidStatus() {
            return bidStatus;
        }

        public void setBidStatus(BidStatus bidStatus) {
            this.bidStatus = bidStatus;
        }
    }
}