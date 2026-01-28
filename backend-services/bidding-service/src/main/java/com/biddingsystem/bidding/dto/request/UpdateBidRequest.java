package com.biddingsystem.bidding.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBidRequest {
    
    @NotNull(message = "Proposed price is required")
    @DecimalMin(value = "0.01", message = "Proposed price must be greater than 0")
    private BigDecimal proposedPrice;
    
    @NotNull(message = "Estimated duration is required")
    @Min(value = 1, message = "Estimated duration must be at least 1 day")
    private Integer estimatedDuration;
    
    @NotBlank(message = "Proposal is required")
    @Size(min = 50, message = "Proposal must be at least 50 characters long")
    private String proposal;
}
