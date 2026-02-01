package com.bidsphere.auctionservice.dto.response;

import com.bidsphere.auctionservice.constant.AuctionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionStatusChangeDTO {
    private String auctionId;
    private AuctionStatus oldStatus;
    private AuctionStatus newStatus;
    private LocalDateTime timestamp;
}
