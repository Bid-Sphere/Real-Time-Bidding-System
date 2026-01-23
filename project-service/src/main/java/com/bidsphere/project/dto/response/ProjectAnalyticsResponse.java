package com.bidsphere.project.dto.response;




import java.math.BigDecimal;

public class ProjectAnalyticsResponse {
    
    private String projectId;
    private Integer totalViews;
    private Integer uniqueViews;
    private Integer bookmarkCount;
    private Integer bidCount;
    private BigDecimal averageBidAmount;
    private Double conversionRate;
    
    // Constructors
    public ProjectAnalyticsResponse() {
    }
    
    public ProjectAnalyticsResponse(String projectId, Integer totalViews, Integer uniqueViews,
                                   Integer bookmarkCount, Integer bidCount,
                                   BigDecimal averageBidAmount, Double conversionRate) {
        this.projectId = projectId;
        this.totalViews = totalViews;
        this.uniqueViews = uniqueViews;
        this.bookmarkCount = bookmarkCount;
        this.bidCount = bidCount;
        this.averageBidAmount = averageBidAmount;
        this.conversionRate = conversionRate;
    }
    
    // Getters and Setters
    public String getProjectId() {
        return projectId;
    }
    
    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }
    
    public Integer getTotalViews() {
        return totalViews;
    }
    
    public void setTotalViews(Integer totalViews) {
        this.totalViews = totalViews;
    }
    
    public Integer getUniqueViews() {
        return uniqueViews;
    }
    
    public void setUniqueViews(Integer uniqueViews) {
        this.uniqueViews = uniqueViews;
    }
    
    public Integer getBookmarkCount() {
        return bookmarkCount;
    }
    
    public void setBookmarkCount(Integer bookmarkCount) {
        this.bookmarkCount = bookmarkCount;
    }
    
    public Integer getBidCount() {
        return bidCount;
    }
    
    public void setBidCount(Integer bidCount) {
        this.bidCount = bidCount;
    }
    
    public BigDecimal getAverageBidAmount() {
        return averageBidAmount;
    }
    
    public void setAverageBidAmount(BigDecimal averageBidAmount) {
        this.averageBidAmount = averageBidAmount;
    }
    
    public Double getConversionRate() {
        return conversionRate;
    }
    
    public void setConversionRate(Double conversionRate) {
        this.conversionRate = conversionRate;
    }
}