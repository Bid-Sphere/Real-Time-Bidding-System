package com.bidsphere.auctionservice.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request DTO for submitting a live bid during an active auction.
 * Requirements: 2.1
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitLiveBidRequest {
    
    @NotNull(message = "Bid amount is required")
    @DecimalMin(value = "0.01", message = "Bid amount must be positive")
    private BigDecimal amount;
}
