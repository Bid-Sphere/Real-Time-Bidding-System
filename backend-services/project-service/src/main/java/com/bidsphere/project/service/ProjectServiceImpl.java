package com.bidsphere.project.service;




import com.bidsphere.project.dto.request.*;
import com.bidsphere.project.dto.response.*;
import com.bidsphere.project.entity.*;
import com.bidsphere.project.enums.*;
import com.bidsphere.project.exception.*;
import com.bidsphere.project.repository.*;
import com.bidsphere.project.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {
    
    private final ProjectRepository projectRepository;
    private final ProjectAttachmentRepository attachmentRepository;
    private final ProjectViewRepository viewRepository;
    private final ProjectBookmarkRepository bookmarkRepository;
    
    private static final String UPLOAD_DIR = "uploads/projects/";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;
    private static final Set<String> ALLOWED_FILE_TYPES = Set.of(
        "application/pdf", "image/jpeg", "image/jpg", "image/png",
        "application/dwg", "application/dxf"
    );
    
    @Autowired
    public ProjectServiceImpl(ProjectRepository projectRepository,
                            ProjectAttachmentRepository attachmentRepository,
                            ProjectViewRepository viewRepository,
                            ProjectBookmarkRepository bookmarkRepository) {
        this.projectRepository = projectRepository;
        this.attachmentRepository = attachmentRepository;
        this.viewRepository = viewRepository;
        this.bookmarkRepository = bookmarkRepository;
    }
    
    @Override
    public ProjectResponse createProject(CreateProjectRequest request, String clientId, String clientName) {
        System.out.println("Creating project: " + request.getTitle() + " for client: " + clientId);
        
        if (request.getBiddingType() == BiddingType.LIVE_AUCTION) {
            validateAuctionEndTime(request.getAuctionEndTime(), request.getDeadline());
        }
        
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setCategory(request.getCategory());
        project.setClientId(clientId);
        project.setClientName(clientName);
        project.setBudget(request.getBudget());
        project.setDeadline(request.getDeadline());
        project.setLocation(request.getLocation());
        project.setRequiredSkills(request.getRequiredSkills() != null ? request.getRequiredSkills() : new ArrayList<>());
        project.setStrictDeadline(request.getStrictDeadline());
        project.setBiddingType(request.getBiddingType());
        project.setAuctionEndTime(request.getAuctionEndTime());
        project.setIsDraft(request.getIsDraft());
        project.setStatus(request.getIsDraft() ? ProjectStatus.DRAFT : ProjectStatus.OPEN);
        
        if (request.getAttachments() != null && !request.getAttachments().isEmpty()) {
            for (CreateProjectRequest.AttachmentRequest attReq : request.getAttachments()) {
                ProjectAttachment attachment = new ProjectAttachment();
                attachment.setFileName(attReq.getFileName());
                attachment.setFileUrl(attReq.getFileUrl());
                attachment.setFileSize(attReq.getFileSize());
                attachment.setFileType(attReq.getFileType());
                attachment.setUploadedBy(clientId);
                project.addAttachment(attachment);
            }
        }
        
        Project savedProject = projectRepository.save(project);
        System.out.println("Project created successfully with ID: " + savedProject.getId());
        
        return mapToResponse(savedProject, null);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(String projectId, String userId) {
        System.out.println("Fetching project: " + projectId + " for user: " + userId);
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
        
        validateProjectVisibility(project, userId);
        
        Boolean isBookmarked = userId != null && 
            bookmarkRepository.existsByProjectIdAndUserId(projectId, userId);
        
        return mapToResponse(project, isBookmarked);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> listProjects(ProjectCategory category, ProjectStatus status,
            BigDecimal minBudget, BigDecimal maxBudget, String location, BiddingType biddingType,
            String search, String sort, Pageable pageable, String userId) {
        
        System.out.println("Listing projects with filters - category: " + category + ", status: " + status);
        
        Pageable sortedPageable = applySorting(pageable, sort);
        
        // Convert enums to strings for native query
        String categoryStr = category != null ? category.name() : null;
        String statusStr = status != null ? status.name() : null;
        String biddingTypeStr = biddingType != null ? biddingType.name() : null;
        
        Page<Project> projects = projectRepository.findWithFilters(
            categoryStr, statusStr, minBudget, maxBudget, location, 
            biddingTypeStr, search, sortedPageable
        );
        
        return projects.map(project -> mapToResponse(project, 
            userId != null && bookmarkRepository.existsByProjectIdAndUserId(project.getId(), userId)
        ));
    }
    
    @Override
    public ProjectResponse updateProject(String projectId, CreateProjectRequest request, String clientId) {
        System.out.println("Updating project: " + projectId + " by client: " + clientId);
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
        
        validateOwnership(project, clientId);
        validateCanEdit(project);
        
        if (request.getTitle() != null) {
            project.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getBudget() != null) {
            project.setBudget(request.getBudget());
        }
        if (request.getDeadline() != null) {
            project.setDeadline(request.getDeadline());
        }
        if (request.getLocation() != null) {
            project.setLocation(request.getLocation());
        }
        if (request.getRequiredSkills() != null) {
            project.setRequiredSkills(request.getRequiredSkills());
        }
        
        Project updatedProject = projectRepository.save(project);
        
        System.out.println("Project updated successfully: " + projectId);
        
        return mapToResponse(updatedProject, null);
    }
    
    @Override
    public void deleteProject(String projectId, String clientId) {
        System.out.println("Deleting project: " + projectId + " by client: " + clientId);
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
        
        validateOwnership(project, clientId);
        
        if (!canDeleteProject(project)) {
            throw new ProjectCannotBeDeletedException(
                "Cannot delete project with status " + project.getStatus()
            );
        }
        
        project.setIsDeleted(true);
        projectRepository.save(project);
        
        System.out.println("Project soft-deleted successfully: " + projectId);
    }
    
    @Override
    public ProjectResponse updateProjectStatus(String projectId, ProjectStatus newStatus, 
            String reason, String clientId) {
        
        System.out.println("Updating status of project: " + projectId + " to: " + newStatus);
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
        
        validateOwnership(project, clientId);
        validateStatusTransition(project.getStatus(), newStatus);
        
        project.setStatus(newStatus);
        Project updatedProject = projectRepository.save(project);
        
        System.out.println("Project status updated to: " + newStatus);
        
        return mapToResponse(updatedProject, null);
    }
    
    @Override
    public ProjectResponse publishProject(String projectId, String clientId) {
        System.out.println("Publishing project: " + projectId);
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
        
        validateOwnership(project, clientId);
        
        if (!project.getIsDraft()) {
            throw new ProjectCannotBeEditedException("Project is already published");
        }
        
        validateProjectForPublishing(project);
        
        project.setIsDraft(false);
        project.setStatus(ProjectStatus.OPEN);
        
        Project publishedProject = projectRepository.save(project);
        
        System.out.println("Project published successfully: " + projectId);
        
        return mapToResponse(publishedProject, null);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> getMyProjects(String clientId, ProjectStatus status, Pageable pageable) {
        System.out.println("Fetching projects for client: " + clientId);
        
        Page<Project> projects = projectRepository.findByClientIdAndIsDeletedFalse(clientId, pageable);
        
        return projects.map(project -> mapToResponse(project, false));
    }
    
    @Override
    @Transactional(readOnly = true)
    public ClientStatsResponse getClientStats(String clientId) {
        System.out.println("Fetching dashboard stats for client: " + clientId);
        
        List<Project> allProjects = projectRepository.findByClientIdAndIsDeletedFalse(clientId, Pageable.unpaged()).getContent();
        
        Long totalProjects = (long) allProjects.size();
        Long draftProjects = allProjects.stream().filter(p -> p.getIsDraft()).count();
        Long activeProjects = (long) projectRepository.findActiveProjectsByClient(clientId).size();
        Long completedProjects = allProjects.stream().filter(p -> p.getStatus() == ProjectStatus.COMPLETED).count();
        
        ClientStatsResponse stats = new ClientStatsResponse();
        stats.setTotalProjects(totalProjects);
        stats.setActiveProjects(activeProjects);
        stats.setDraftProjects(draftProjects);
        stats.setCompletedProjects(completedProjects);
        stats.setTotalBidsReceived(0);
        stats.setAverageBidsPerProject(0.0);
        stats.setAverageBidAmount(BigDecimal.ZERO);
        
        return stats;
    }
    
    @Override
    public ProjectResponse.AttachmentResponse uploadAttachment(
            String projectId, MultipartFile file, String clientId) {
        
        System.out.println("Uploading attachment for project: " + projectId);
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
        
        validateOwnership(project, clientId);
        validateFile(file);
        
        try {
            String fileName = saveFile(file, projectId);
            String fileUrl = "/uploads/projects/" + projectId + "/" + fileName;
            
            ProjectAttachment attachment = new ProjectAttachment();
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileUrl(fileUrl);
            attachment.setFileSize(file.getSize());
            attachment.setFileType(file.getContentType());
            attachment.setUploadedBy(clientId);
            
            project.addAttachment(attachment);
            projectRepository.save(project);
            
            System.out.println("Attachment uploaded successfully");
            
            ProjectResponse.AttachmentResponse response = new ProjectResponse.AttachmentResponse();
            response.setId(attachment.getId());
            response.setFileName(attachment.getFileName());
            response.setFileUrl(attachment.getFileUrl());
            response.setFileSize(attachment.getFileSize());
            response.setFileType(attachment.getFileType());
            response.setUploadedAt(attachment.getUploadedAt());
            response.setUploadedBy(attachment.getUploadedBy());
            
            return response;
            
        } catch (IOException e) {
            System.err.println("Failed to upload file: " + e.getMessage());
            throw new FileUploadException("Failed to upload file: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void deleteAttachment(String projectId, String attachmentId, String clientId) {
        System.out.println("Deleting attachment: " + attachmentId + " from project: " + projectId);
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
        
        validateOwnership(project, clientId);
        
        ProjectAttachment attachment = attachmentRepository
                .findByIdAndProjectId(attachmentId, projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Attachment not found"));
        
        deleteFile(attachment.getFileUrl());
        project.removeAttachment(attachment);
        attachmentRepository.delete(attachment);
        
        System.out.println("Attachment deleted successfully");
    }
    
    @Override
    public void trackView(String projectId, String userId, String userType, String sessionId) {
        System.out.println("Tracking view for project: " + projectId);
        
        if (userId != null && viewRepository.existsByProjectIdAndUserId(projectId, userId)) {
            return;
        }
        
        if (userId == null && sessionId != null && 
            viewRepository.existsByProjectIdAndSessionId(projectId, sessionId)) {
            return;
        }
        
        ProjectView view = new ProjectView();
        view.setProjectId(projectId);
        view.setUserId(userId);
        view.setUserType(userType);
        view.setSessionId(sessionId != null ? sessionId : UUID.randomUUID().toString());
        
        viewRepository.save(view);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProjectAnalyticsResponse getProjectAnalytics(String projectId, String clientId) {
        System.out.println("Fetching analytics for project: " + projectId);
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
        
        validateOwnership(project, clientId);
        
        Long totalViews = viewRepository.countByProjectId(projectId);
        Long uniqueViews = viewRepository.countUniqueViewsByProjectId(projectId);
        Long bookmarkCount = bookmarkRepository.countByProjectId(projectId);
        
        ProjectAnalyticsResponse analytics = new ProjectAnalyticsResponse();
        analytics.setProjectId(projectId);
        analytics.setTotalViews(totalViews.intValue());
        analytics.setUniqueViews(uniqueViews.intValue());
        analytics.setBookmarkCount(bookmarkCount.intValue());
        analytics.setBidCount(0);
        analytics.setAverageBidAmount(BigDecimal.ZERO);
        analytics.setConversionRate(0.0);
        
        return analytics;
    }
    
    // Helper methods
    private void validateOwnership(Project project, String clientId) {
        if (!project.getClientId().equals(clientId)) {
            throw new UnauthorizedException("You are not the owner of this project");
        }
    }
    
    private void validateProjectVisibility(Project project, String userId) {
        if (project.getIsDraft() && !project.getClientId().equals(userId)) {
            throw new ProjectNotFoundException(project.getId());
        }
    }
    
    private void validateCanEdit(Project project) {
        List<ProjectStatus> editableStatuses = Arrays.asList(
            ProjectStatus.DRAFT, ProjectStatus.OPEN, 
            ProjectStatus.ACCEPTING_BIDS, ProjectStatus.IN_DISCUSSION
        );
        
        if (!editableStatuses.contains(project.getStatus())) {
            throw new ProjectCannotBeEditedException(
                "Cannot edit project with status: " + project.getStatus()
            );
        }
    }
    
    private boolean canDeleteProject(Project project) {
        return project.getStatus() == ProjectStatus.DRAFT || 
               project.getStatus() == ProjectStatus.OPEN;
    }
    
    private void validateStatusTransition(ProjectStatus current, ProjectStatus next) {
        Map<ProjectStatus, List<ProjectStatus>> validTransitions = Map.of(
            ProjectStatus.DRAFT, List.of(ProjectStatus.OPEN),
            ProjectStatus.OPEN, List.of(ProjectStatus.ACCEPTING_BIDS, ProjectStatus.CLOSED, ProjectStatus.IN_PROGRESS),
            ProjectStatus.ACCEPTING_BIDS, List.of(ProjectStatus.IN_DISCUSSION, ProjectStatus.CLOSED, ProjectStatus.IN_PROGRESS),
            ProjectStatus.IN_DISCUSSION, List.of(ProjectStatus.ACCEPTING_BIDS, ProjectStatus.CLOSED, ProjectStatus.IN_PROGRESS),
            ProjectStatus.CLOSED, List.of(ProjectStatus.IN_PROGRESS),
            ProjectStatus.IN_PROGRESS, List.of(ProjectStatus.COMPLETED)
        );
        
        if (!validTransitions.getOrDefault(current, List.of()).contains(next)) {
            throw new InvalidStatusTransitionException(current.name(), next.name());
        }
    }
    
    private void validateAuctionEndTime(LocalDateTime auctionEndTime, LocalDateTime deadline) {
        if (auctionEndTime == null) {
            throw new IllegalArgumentException("Auction end time is required for live auctions");
        }
    }
    
    private void validateProjectForPublishing(Project project) {
        if (project.getTitle() == null || project.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileUploadException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileTooLargeException(file.getSize(), MAX_FILE_SIZE);
        }
        if (!ALLOWED_FILE_TYPES.contains(file.getContentType())) {
            throw new InvalidFileTypeException(file.getContentType());
        }
    }
    
    private String saveFile(MultipartFile file, String projectId) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR, projectId);
        Files.createDirectories(uploadPath);
        
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return fileName;
    }
    
    private void deleteFile(String fileUrl) {
        try {
            Path filePath = Paths.get(fileUrl);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + fileUrl);
        }
    }
    
    private Pageable applySorting(Pageable pageable, String sort) {
        if (sort == null) {
            return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "created_at"));
        }
        
        Sort sortObj = switch (sort) {
            case "oldest" -> Sort.by(Sort.Direction.ASC, "created_at");
            case "budget_high" -> Sort.by(Sort.Direction.DESC, "budget");
            case "budget_low" -> Sort.by(Sort.Direction.ASC, "budget");
            case "deadline_urgent" -> Sort.by(Sort.Direction.ASC, "deadline");
            default -> Sort.by(Sort.Direction.DESC, "created_at");
        };
        
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortObj);
    }
    
    private ProjectResponse mapToResponse(Project project, Boolean isBookmarked) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setCategory(project.getCategory());
        response.setClientId(project.getClientId());
        response.setClientName(project.getClientName());
        response.setBudget(project.getBudget());
        response.setDeadline(project.getDeadline());
        response.setLocation(project.getLocation());
        response.setRequiredSkills(project.getRequiredSkills());
        response.setStrictDeadline(project.getStrictDeadline());
        response.setBiddingType(project.getBiddingType());
        response.setStatus(project.getStatus());
        response.setAuctionEndTime(project.getAuctionEndTime());
        response.setAttachments(project.getAttachments().stream()
                .map(this::mapAttachmentToResponse)
                .collect(Collectors.toList()));
        response.setBidCount(0);
        response.setViewCount(viewRepository.countByProjectId(project.getId()).intValue());
        response.setAverageBidAmount(BigDecimal.ZERO);
        response.setIsBookmarked(isBookmarked != null ? isBookmarked : false);
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());
        
        return response;
    }
    
    private ProjectResponse.AttachmentResponse mapAttachmentToResponse(ProjectAttachment attachment) {
        ProjectResponse.AttachmentResponse response = new ProjectResponse.AttachmentResponse();
        response.setId(attachment.getId());
        response.setFileName(attachment.getFileName());
        response.setFileUrl(attachment.getFileUrl());
        response.setFileSize(attachment.getFileSize());
        response.setFileType(attachment.getFileType());
        response.setUploadedAt(attachment.getUploadedAt());
        response.setUploadedBy(attachment.getUploadedBy());
        return response;
    }
}