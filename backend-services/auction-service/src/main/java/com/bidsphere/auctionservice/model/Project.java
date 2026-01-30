package com.bidsphere.auctionservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project
{
    private String id;
    private String title;
    private String description;
    private String category;
    private String clientId;
    private String clientName;
    private BigDecimal budget;
    private LocalDateTime deadline;
    private String location;
    private Boolean strictDeadline;
    private String biddingType;
    private String status;
    private LocalDateTime auctionEndTime;
    private Boolean isDraft;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}