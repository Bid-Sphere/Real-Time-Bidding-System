package com.bidsphere.project.entity;


import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_views", indexes = {
    @Index(name = "idx_project_id", columnList = "project_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_viewed_at", columnList = "viewed_at")
})
public class ProjectView {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "project_id", nullable = false, length = 100)
    private String projectId;
    
    @Column(name = "user_id", length = 100)
    private String userId;
    
    @Column(name = "user_type", length = 20)
    private String userType;
    
    @CreationTimestamp
    @Column(name = "viewed_at", nullable = false, updatable = false)
    private LocalDateTime viewedAt;
    
    @Column(name = "session_id", nullable = false, length = 100)
    private String sessionId;
    
    // Constructors
    public ProjectView() {
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
    
    public LocalDateTime getViewedAt() { return viewedAt; }
    public void setViewedAt(LocalDateTime viewedAt) { this.viewedAt = viewedAt; }
    
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}