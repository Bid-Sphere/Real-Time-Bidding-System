package com.bidsphere.project.entity;



import com.bidsphere.project.enums.*;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_client_id", columnList = "client_id"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_is_draft", columnList = "is_draft"),
    @Index(name = "idx_is_deleted", columnList = "is_deleted")
})
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectCategory category;
    
    @Column(name = "client_id", nullable = false, length = 100)
    private String clientId;
    
    @Column(name = "client_name", nullable = false, length = 200)
    private String clientName;
    
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal budget;
    
    @Column(nullable = false)
    private LocalDateTime deadline;
    
    @Column(length = 200)
    private String location;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_skills", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "skill", length = 50)
    private List<String> requiredSkills = new ArrayList<>();
    
    @Column(name = "strict_deadline", nullable = false)
    private Boolean strictDeadline = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "bidding_type", nullable = false, length = 20)
    private BiddingType biddingType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectStatus status = ProjectStatus.DRAFT;
    
    @Column(name = "auction_end_time")
    private LocalDateTime auctionEndTime;
    
    @Column(name = "auction_id")
    private Long auctionId;
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProjectAttachment> attachments = new ArrayList<>();
    
    @Column(name = "is_draft", nullable = false)
    private Boolean isDraft = false;
    
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Transient
    private Integer bidCount = 0;
    
    @Transient
    private Integer viewCount = 0;
    
    @Transient
    private BigDecimal averageBidAmount = BigDecimal.ZERO;
    
    // Constructors
    public Project() {
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ProjectCategory getCategory() { return category; }
    public void setCategory(ProjectCategory category) { this.category = category; }
    
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    
    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }
    
    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }
    
    public Boolean getStrictDeadline() { return strictDeadline; }
    public void setStrictDeadline(Boolean strictDeadline) { this.strictDeadline = strictDeadline; }
    
    public BiddingType getBiddingType() { return biddingType; }
    public void setBiddingType(BiddingType biddingType) { this.biddingType = biddingType; }
    
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    
    public LocalDateTime getAuctionEndTime() { return auctionEndTime; }
    public void setAuctionEndTime(LocalDateTime auctionEndTime) { this.auctionEndTime = auctionEndTime; }
    
    public Long getAuctionId() { return auctionId; }
    public void setAuctionId(Long auctionId) { this.auctionId = auctionId; }
    
    public List<ProjectAttachment> getAttachments() { return attachments; }
    public void setAttachments(List<ProjectAttachment> attachments) { this.attachments = attachments; }
    
    public Boolean getIsDraft() { return isDraft; }
    public void setIsDraft(Boolean isDraft) { this.isDraft = isDraft; }
    
    public Boolean getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Integer getBidCount() { return bidCount; }
    public void setBidCount(Integer bidCount) { this.bidCount = bidCount; }
    
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
    
    public BigDecimal getAverageBidAmount() { return averageBidAmount; }
    public void setAverageBidAmount(BigDecimal averageBidAmount) { this.averageBidAmount = averageBidAmount; }
    
    // Helper methods
    public void addAttachment(ProjectAttachment attachment) {
        attachments.add(attachment);
        attachment.setProject(this);
    }
    
    public void removeAttachment(ProjectAttachment attachment) {
        attachments.remove(attachment);
        attachment.setProject(null);
    }
}