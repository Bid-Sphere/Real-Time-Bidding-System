package com.bidsphere.auctionservice.dto.response;

import com.bidsphere.auctionservice.constant.BidStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BidDTO {
    private String id;
    private String auctionId;
    private String organizationId;
    private String organizationName;
    private BigDecimal amount;
    private BidStatus status;
    private LocalDateTime createdAt;
    private boolean isCurrentLowest;
}
