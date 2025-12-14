package com.bidsphere.project.entity;




import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_bookmarks", 
    indexes = {
        @Index(name = "idx_bookmark_user_id", columnList = "user_id"),
        @Index(name = "idx_bookmark_project_id", columnList = "project_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_project", columnNames = {"user_id", "project_id"})
    }
)
public class ProjectBookmark {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "project_id", nullable = false, length = 100)
    private String projectId;
    
    @Column(name = "user_id", nullable = false, length = 100)
    private String userId;
    
    @CreationTimestamp
    @Column(name = "bookmarked_at", nullable = false, updatable = false)
    private LocalDateTime bookmarkedAt;
    
    // Constructors
    public ProjectBookmark() {
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public LocalDateTime getBookmarkedAt() { return bookmarkedAt; }
    public void setBookmarkedAt(LocalDateTime bookmarkedAt) { this.bookmarkedAt = bookmarkedAt; }
}