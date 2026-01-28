package com.biddingsystem.bidding.dto.response;

import com.biddingsystem.bidding.enums.BidStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidActionResponse {
    
    private String id;
    private BidStatus status;
    private LocalDateTime acceptedAt;
}
