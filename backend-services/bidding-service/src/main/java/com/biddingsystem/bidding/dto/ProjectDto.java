package com.biddingsystem.bidding.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for Project information received from Project Service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    
    private String id;
    private String title;
    private String description;
    private String clientId;
    private String clientName;
    private String status; // DRAFT, OPEN, IN_PROGRESS, COMPLETED, CANCELLED
    private BigDecimal budget;
    private String category;
    private String biddingType; // STANDARD, LIVE_AUCTION
}
