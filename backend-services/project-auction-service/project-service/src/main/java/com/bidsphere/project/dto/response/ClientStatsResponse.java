package com.bidsphere.project.dto.response;






import java.math.BigDecimal;

public class ClientStatsResponse {
    
    private Long totalProjects;
    private Long activeProjects;
    private Long draftProjects;
    private Long completedProjects;
    private Integer totalBidsReceived;
    private Double averageBidsPerProject;
    private BigDecimal averageBidAmount;
    
    // Constructors
    public ClientStatsResponse() {
    }
    
    public ClientStatsResponse(Long totalProjects, Long activeProjects, Long draftProjects,
                              Long completedProjects, Integer totalBidsReceived,
                              Double averageBidsPerProject, BigDecimal averageBidAmount) {
        this.totalProjects = totalProjects;
        this.activeProjects = activeProjects;
        this.draftProjects = draftProjects;
        this.completedProjects = completedProjects;
        this.totalBidsReceived = totalBidsReceived;
        this.averageBidsPerProject = averageBidsPerProject;
        this.averageBidAmount = averageBidAmount;
    }
    
    // Getters and Setters
    public Long getTotalProjects() {
        return totalProjects;
    }
    
    public void setTotalProjects(Long totalProjects) {
        this.totalProjects = totalProjects;
    }
    
    public Long getActiveProjects() {
        return activeProjects;
    }
    
    public void setActiveProjects(Long activeProjects) {
        this.activeProjects = activeProjects;
    }
    
    public Long getDraftProjects() {
        return draftProjects;
    }
    
    public void setDraftProjects(Long draftProjects) {
        this.draftProjects = draftProjects;
    }
    
    public Long getCompletedProjects() {
        return completedProjects;
    }
    
    public void setCompletedProjects(Long completedProjects) {
        this.completedProjects = completedProjects;
    }
    
    public Integer getTotalBidsReceived() {
        return totalBidsReceived;
    }
    
    public void setTotalBidsReceived(Integer totalBidsReceived) {
        this.totalBidsReceived = totalBidsReceived;
    }
    
    public Double getAverageBidsPerProject() {
        return averageBidsPerProject;
    }
    
    public void setAverageBidsPerProject(Double averageBidsPerProject) {
        this.averageBidsPerProject = averageBidsPerProject;
    }
    
    public BigDecimal getAverageBidAmount() {
        return averageBidAmount;
    }
    
    public void setAverageBidAmount(BigDecimal averageBidAmount) {
        this.averageBidAmount = averageBidAmount;
    }
}
