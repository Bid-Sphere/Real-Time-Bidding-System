package com.biddingsystem.bidding.entity;

import com.biddingsystem.bidding.enums.BidStatus;
import com.biddingsystem.bidding.enums.BidderType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bids")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bid {
    
    @Id
    @Column(name = "id")
    private String id;
    
    @Column(name = "project_id", nullable = false)
    private String projectId;
    
    @Column(name = "bidder_id", nullable = false)
    private String bidderId;
    
    @Column(name = "bidder_name", nullable = false)
    private String bidderName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "bidder_type", nullable = false)
    private BidderType bidderType;
    
    @Column(name = "proposed_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal proposedPrice;
    
    @Column(name = "estimated_duration", nullable = false)
    private Integer estimatedDuration;
    
    @Column(name = "proposal", nullable = false, columnDefinition = "TEXT")
    private String proposal;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BidStatus status;
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;
    
    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;
    
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
    
    @Column(name = "is_withdrawn", nullable = false)
    private Boolean isWithdrawn;
    
    @Column(name = "withdrawn_at")
    private LocalDateTime withdrawnAt;
    
    @PrePersist
    protected void onCreate() {
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = BidStatus.PENDING;
        }
        if (bidderType == null) {
            bidderType = BidderType.ORGANIZATION;
        }
        if (isWithdrawn == null) {
            isWithdrawn = false;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
