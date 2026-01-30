package com.biddingsystem.bidding.dto.response;

import com.biddingsystem.bidding.enums.BidStatus;
import com.biddingsystem.bidding.enums.BidderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidResponse {
    
    private String id;
    private String projectId;
    private String projectTitle; // Optional - for detailed views
    private String bidderId;
    private String bidderName;
    private BidderType bidderType;
    private BigDecimal proposedPrice;
    private Integer estimatedDuration;
    private String proposal;
    private BidStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime rejectedAt;
    private String rejectionReason;
    private Integer ranking; // Calculated field
    private Integer totalBids; // For "my bids" view
    
    // Client contact info (only populated for accepted bids)
    private String clientEmail;
    private String clientPhone;
}
