package com.bidsphere.project.controller;

import com.bidsphere.project.dto.request.*;
import com.bidsphere.project.dto.response.*;
import com.bidsphere.project.enums.*;
import com.bidsphere.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    private final ProjectService projectService;
    
    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @RequestHeader(value = "X-User-Id", required = true) String clientId,
            @RequestHeader(value = "X-User-Name", required = true) String clientName,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        
        System.out.println("Creating project: " + request.getTitle() + " by client: " + clientId);
        
        if (!"CLIENT".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only clients can create projects"));
        }
        
        ProjectResponse response = projectService.createProject(request, clientId, clientName);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully", response));
    }
    
    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(
            @PathVariable String projectId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        System.out.println("Fetching project: " + projectId);
        
        ProjectResponse response = projectService.getProjectById(projectId, userId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProjectResponse>>> listProjects(
            @RequestParam(required = false) ProjectCategory category,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(required = false) BigDecimal maxBudget,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BiddingType biddingType,
            @RequestParam(required = false) ProjectVisibility visibility,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        System.out.println("Listing projects - page: " + page + ", limit: " + limit);
        
        if (limit > 100) limit = 100;
        
        Pageable pageable = PageRequest.of(page, limit);
        
        Page<ProjectResponse> projects = projectService.listProjects(
            category, status, minBudget, maxBudget, location,
            biddingType, visibility, search, sort, pageable, userId
        );
        
        return ResponseEntity.ok(ApiResponse.success(projects));
    }
    
    @PutMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable String projectId,
            @Valid @RequestBody CreateProjectRequest request,
            @RequestHeader(value = "X-User-Id", required = true) String clientId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        
        System.out.println("Updating project: " + projectId + " by client: " + clientId);
        
        if (!"CLIENT".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only clients can update projects"));
        }
        
        ProjectResponse response = projectService.updateProject(projectId, request, clientId);
        
        return ResponseEntity.ok(
            ApiResponse.success("Project updated successfully", response)
        );
    }
    
    @DeleteMapping("/{projectId}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable String projectId,
            @RequestHeader(value = "X-User-Id", required = true) String clientId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        
        System.out.println("Deleting project: " + projectId + " by client: " + clientId);
        
        if (!"CLIENT".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only clients can delete projects"));
        }
        
        projectService.deleteProject(projectId, clientId);
        
        return ResponseEntity.ok(
            ApiResponse.success("Project deleted successfully", null)
        );
    }
    
    @PatchMapping("/{projectId}/status")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProjectStatus(
            @PathVariable String projectId,
            @RequestBody UpdateStatusRequest request,
            @RequestHeader(value = "X-User-Id", required = true) String clientId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        
        System.out.println("Updating status of project: " + projectId + " to: " + request.getStatus());
        
        if (!"CLIENT".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only clients can update project status"));
        }
        
        ProjectResponse response = projectService.updateProjectStatus(
            projectId, request.getStatus(), request.getReason(), clientId
        );
        
        return ResponseEntity.ok(
            ApiResponse.success("Project status updated successfully", response)
        );
    }
    
    @PostMapping("/{projectId}/publish")
    public ResponseEntity<ApiResponse<ProjectResponse>> publishProject(
            @PathVariable String projectId,
            @RequestHeader(value = "X-User-Id", required = true) String clientId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        
        System.out.println("Publishing project: " + projectId);
        
        if (!"CLIENT".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only clients can publish projects"));
        }
        
        ProjectResponse response = projectService.publishProject(projectId, clientId);
        
        return ResponseEntity.ok(
            ApiResponse.success("Project published successfully", response)
        );
    }
    
    @GetMapping("/my-projects")
    public ResponseEntity<ApiResponse<Page<ProjectResponse>>> getMyProjects(
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestHeader(value = "X-User-Id", required = true) String clientId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        
        System.out.println("Fetching my projects for client: " + clientId);
        
        if (!"CLIENT".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only clients can access this endpoint"));
        }
        
        Pageable pageable = PageRequest.of(page, limit);
        Page<ProjectResponse> projects = projectService.getMyProjects(clientId, status, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(projects));
    }
    
    @GetMapping("/client/stats")
    public ResponseEntity<ApiResponse<ClientStatsResponse>> getClientStats(
            @RequestHeader(value = "X-User-Id", required = true) String clientId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        
        System.out.println("Fetching dashboard stats for client: " + clientId);
        
        if (!"CLIENT".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only clients can access this endpoint"));
        }
        
        ClientStatsResponse stats = projectService.getClientStats(clientId);
        
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
    
    @PostMapping("/{projectId}/attachments")
    public ResponseEntity<ApiResponse<ProjectResponse.AttachmentResponse>> uploadAttachment(
            @PathVariable String projectId,
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-User-Id", required = true) String clientId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        
        System.out.println("Uploading attachment for project: " + projectId);
        
        if (!"CLIENT".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only clients can upload attachments"));
        }
        
        ProjectResponse.AttachmentResponse response = 
            projectService.uploadAttachment(projectId, file, clientId);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Attachment uploaded successfully", response));
    }
    
    @DeleteMapping("/{projectId}/attachments/{attachmentId}")
    public ResponseEntity<ApiResponse<Void>> deleteAttachment(
            @PathVariable String projectId,
            @PathVariable String attachmentId,
            @RequestHeader(value = "X-User-Id", required = true) String clientId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        
        System.out.println("Deleting attachment: " + attachmentId + " from project: " + projectId);
        
        if (!"CLIENT".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only clients can delete attachments"));
        }
        
        projectService.deleteAttachment(projectId, attachmentId, clientId);
        
        return ResponseEntity.ok(
            ApiResponse.success("Attachment deleted successfully", null)
        );
    }
    
    @PostMapping("/{projectId}/view")
    public ResponseEntity<ApiResponse<Void>> trackView(
            @PathVariable String projectId,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Type", required = false) String userType,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        
        System.out.println("Tracking view for project: " + projectId);
        
        projectService.trackView(projectId, userId, userType, sessionId);
        
        return ResponseEntity.ok(
            ApiResponse.success("View tracked successfully", null)
        );
    }
    
    @GetMapping("/{projectId}/analytics")
    public ResponseEntity<ApiResponse<ProjectAnalyticsResponse>> getProjectAnalytics(
            @PathVariable String projectId,
            @RequestHeader(value = "X-User-Id", required = true) String clientId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        
        System.out.println("Fetching analytics for project: " + projectId);
        
        if (!"CLIENT".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only project owners can view analytics"));
        }
        
        ProjectAnalyticsResponse analytics = 
            projectService.getProjectAnalytics(projectId, clientId);
        
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
    
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
            ApiResponse.success("Project Service is running", "OK")
        );
    }
}