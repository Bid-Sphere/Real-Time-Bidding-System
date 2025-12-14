package com.bidsphere.project.dto.request;



import com.bidsphere.project.enums.ProjectStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {
    
    @NotNull(message = "Status is required")
    private ProjectStatus status;
    
    private String reason;
    
    // Constructors
    public UpdateStatusRequest() {
    }
    
    public UpdateStatusRequest(ProjectStatus status, String reason) {
        this.status = status;
        this.reason = reason;
    }
    
    // Getters and Setters
    public ProjectStatus getStatus() {
        return status;
    }
    
    public void setStatus(ProjectStatus status) {
        this.status = status;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
}