package com.bidsphere.auctionservice.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class MyAuctionBidsResponse {

    private List<MyAuctionBid> content;
    private long totalElements;
    private int totalPages;

    @Data
    public static class MyAuctionBid {
        private String auctionId;
        private String projectId;
        private String projectTitle;
        private BigDecimal myHighestBid;
        private BigDecimal currentHighestBid;
        private Boolean isWinning;
        private String auctionStatus;

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime endTime;

        private Long timeRemaining;

        public String getAuctionId() {
            return auctionId;
        }

        public void setAuctionId(String auctionId) {
            this.auctionId = auctionId;
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

        public BigDecimal getMyHighestBid() {
            return myHighestBid;
        }

        public void setMyHighestBid(BigDecimal myHighestBid) {
            this.myHighestBid = myHighestBid;
        }

        public BigDecimal getCurrentHighestBid() {
            return currentHighestBid;
        }

        public void setCurrentHighestBid(BigDecimal currentHighestBid) {
            this.currentHighestBid = currentHighestBid;
        }

        public Boolean getIsWinning() {
            return isWinning;
        }

        public void setIsWinning(Boolean isWinning) {
            this.isWinning = isWinning;
        }

        public String getAuctionStatus() {
            return auctionStatus;
        }

        public void setAuctionStatus(String auctionStatus) {
            this.auctionStatus = auctionStatus;
        }

        public LocalDateTime getEndTime() {
            return endTime;
        }

        public void setEndTime(LocalDateTime endTime) {
            this.endTime = endTime;
        }

        public Long getTimeRemaining() {
            return timeRemaining;
        }

        public void setTimeRemaining(Long timeRemaining) {
            this.timeRemaining = timeRemaining;
        }
    }
}