package com.bidsphere.project.service;




import com.bidsphere.project.dto.request.*;
import com.bidsphere.project.dto.response.*;
import com.bidsphere.project.enums.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface ProjectService {
    
    ProjectResponse createProject(CreateProjectRequest request, String clientId, String clientName);
    
    ProjectResponse getProjectById(String projectId, String userId);
    

     //List projects with filters

    Page<ProjectResponse> listProjects(
        ProjectCategory category,
        ProjectStatus status,
        BigDecimal minBudget,
        BigDecimal maxBudget,
        String location,
        BiddingType biddingType,
        ProjectVisibility visibility,
        String search,
        String sort,
        Pageable pageable,
        String userId
    );
    
    /**
     * Update project
     */
    ProjectResponse updateProject(
        String projectId, 
        CreateProjectRequest request, 
        String clientId
    );
    
    /**
     * Delete project
     */
    void deleteProject(String projectId, String clientId);

    
    /**
     * Update project status
     */
    ProjectResponse updateProjectStatus(
        String projectId, 
        ProjectStatus newStatus, 
        String reason,
        String clientId
    );
    
    /**
     * Publish draft project
     */
    ProjectResponse publishProject(String projectId, String clientId);
    
    // =============== CLIENT DASHBOARD ===============
    
    /**
     * Get client's projects
     */
    Page<ProjectResponse> getMyProjects(
        String clientId, 
        ProjectStatus status, 
        Pageable pageable
    );
    
    /**
     * Get client dashboard statistics
     */
    ClientStatsResponse getClientStats(String clientId);
    
    // =============== FILE MANAGEMENT ===============
    
    /**
     * Upload project attachment
     */
    ProjectResponse.AttachmentResponse uploadAttachment(
        String projectId, 
        MultipartFile file, 
        String clientId
    );
    
    /**
     * Delete attachment
     */
    void deleteAttachment(String projectId, String attachmentId, String clientId);
    
    
    /**
     * Track project view
     */
    void trackView(String projectId, String userId, String userType, String sessionId);
    
    /**
     * Get project analytics
     */
    ProjectAnalyticsResponse getProjectAnalytics(String projectId, String clientId);
}