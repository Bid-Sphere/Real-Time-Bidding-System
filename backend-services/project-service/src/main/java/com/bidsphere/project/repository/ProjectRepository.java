package com.bidsphere.project.repository;




import com.bidsphere.project.entity.Project;
import com.bidsphere.project.enums.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    
    Page<Project> findByStatusAndIsDeletedFalse(ProjectStatus status, Pageable pageable);
    
    Page<Project> findByClientIdAndIsDeletedFalse(String clientId, Pageable pageable);
    
    Page<Project> findByCategoryAndIsDeletedFalseAndIsDraftFalse(
        ProjectCategory category, Pageable pageable);
    
    Page<Project> findByVisibilityAndIsDeletedFalseAndIsDraftFalse(
        ProjectVisibility visibility, Pageable pageable);
    
    @Query("SELECT p FROM Project p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:minBudget IS NULL OR p.budget >= :minBudget) AND " +
           "(:maxBudget IS NULL OR p.budget <= :maxBudget) AND " +
           "(:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:biddingType IS NULL OR p.biddingType = :biddingType) AND " +
           "(:visibility IS NULL OR p.visibility = :visibility) AND " +
           "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "p.isDeleted = false AND p.isDraft = false")
    Page<Project> findWithFilters(
        @Param("category") ProjectCategory category,
        @Param("status") ProjectStatus status,
        @Param("minBudget") BigDecimal minBudget,
        @Param("maxBudget") BigDecimal maxBudget,
        @Param("location") String location,
        @Param("biddingType") BiddingType biddingType,
        @Param("visibility") ProjectVisibility visibility,
        @Param("search") String search,
        Pageable pageable
    );
    
    Long countByClientIdAndStatusAndIsDeletedFalse(String clientId, ProjectStatus status);
    
    List<Project> findByClientIdAndIsDraftTrueAndIsDeletedFalse(String clientId);
    
    @Query("SELECT p FROM Project p WHERE p.clientId = :clientId AND " +
           "p.status IN ('OPEN', 'ACCEPTING_BIDS', 'IN_DISCUSSION') AND " +
           "p.isDeleted = false")
    List<Project> findActiveProjectsByClient(@Param("clientId") String clientId);
    
    List<Project> findByDeadlineBetweenAndIsDeletedFalseAndIsDraftFalse(
        LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END " +
           "FROM Project p WHERE p.id = :projectId AND p.clientId = :clientId")
    boolean existsByIdAndClientId(
        @Param("projectId") String projectId, 
        @Param("clientId") String clientId);
}