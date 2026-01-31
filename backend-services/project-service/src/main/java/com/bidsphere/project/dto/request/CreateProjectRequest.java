package com.bidsphere.project.dto.request;



import com.bidsphere.project.enums.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CreateProjectRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 10, max = 200, message = "Title must be between 10 and 200 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-_.,()]+$", message = "Title contains invalid characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(min = 50, max = 5000, message = "Description must be between 50 and 5000 characters")
    private String description;
    
    @NotNull(message = "Category is required")
    private ProjectCategory category;
    
    @NotNull(message = "Budget is required")
    @DecimalMin(value = "100.0", message = "Budget must be at least $100")
    @DecimalMax(value = "10000000.0", message = "Budget cannot exceed $10,000,000")
    private BigDecimal budget;
    
    @NotNull(message = "Deadline is required")
    @Future(message = "Deadline must be in the future")
    private LocalDateTime deadline;
    
    @Size(max = 200, message = "Location cannot exceed 200 characters")
    private String location;
    
    @Size(max = 20, message = "Cannot specify more than 20 skills")
    private List<String> requiredSkills;
    
    private Boolean strictDeadline = false;
    
    @NotNull(message = "Bidding type is required")
    private BiddingType biddingType;
    
    private LocalDateTime auctionStartTime;
    private LocalDateTime auctionEndTime;
    private List<AttachmentRequest> attachments;
    private Boolean isDraft = false;
    
    // Constructors
    public CreateProjectRequest() {
        this.strictDeadline = false;
        this.isDraft = false;
        this.requiredSkills = new ArrayList<>();
        this.attachments = new ArrayList<>();
    }
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ProjectCategory getCategory() { return category; }
    public void setCategory(ProjectCategory category) { this.category = category; }
    
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
    
    public LocalDateTime getAuctionStartTime() { return auctionStartTime; }
    public void setAuctionStartTime(LocalDateTime auctionStartTime) { this.auctionStartTime = auctionStartTime; }
    
    public LocalDateTime getAuctionEndTime() { return auctionEndTime; }
    public void setAuctionEndTime(LocalDateTime auctionEndTime) { this.auctionEndTime = auctionEndTime; }
    
    public List<AttachmentRequest> getAttachments() { return attachments; }
    public void setAttachments(List<AttachmentRequest> attachments) { this.attachments = attachments; }
    
    public Boolean getIsDraft() { return isDraft; }
    public void setIsDraft(Boolean isDraft) { this.isDraft = isDraft; }
    
    // Custom validation methods
    @AssertTrue(message = "Auction start and end times are required for live auctions")
    public boolean isAuctionTimesValid() {
        if (biddingType == BiddingType.LIVE_AUCTION) {
            return auctionStartTime != null && 
                   auctionEndTime != null &&
                   auctionStartTime.isAfter(LocalDateTime.now()) && 
                   auctionEndTime.isAfter(auctionStartTime) &&
                   auctionEndTime.isBefore(deadline);
        }
        return true;
    }
    
    @AssertTrue(message = "Deadline must be at least 24 hours from now")
    public boolean isDeadlineValid() {
        return deadline == null || deadline.isAfter(LocalDateTime.now().plusHours(24));
    }
    
    // Inner class for AttachmentRequest
    public static class AttachmentRequest {
        
        @NotBlank(message = "File name is required")
        private String fileName;
        
        @NotBlank(message = "File URL is required")
        private String fileUrl;
        
        @NotNull(message = "File size is required")
        @Min(value = 1, message = "File size must be positive")
        @Max(value = 10485760, message = "File size cannot exceed 10MB")
        private Long fileSize;
        
        @NotBlank(message = "File type is required")
        private String fileType;
        
        public AttachmentRequest() {}
        
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        
        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
        
        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
        
        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }
    }
}