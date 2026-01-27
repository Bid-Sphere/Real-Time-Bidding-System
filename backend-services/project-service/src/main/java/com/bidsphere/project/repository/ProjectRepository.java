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
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    
    // Override findById to exclude soft-deleted projects
    @Query("SELECT p FROM Project p WHERE p.id = :id AND (p.isDeleted = false OR p.isDeleted IS NULL)")
    Optional<Project> findById(@Param("id") String id);
    
    Page<Project> findByStatusAndIsDeletedFalse(ProjectStatus status, Pageable pageable);
    
    Page<Project> findByClientIdAndIsDeletedFalse(String clientId, Pageable pageable);
    
    Page<Project> findByCategoryAndIsDeletedFalseAndIsDraftFalse(
        ProjectCategory category, Pageable pageable);
    
    @Query(value = "SELECT p.* FROM projects p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:minBudget IS NULL OR p.budget >= :minBudget) AND " +
           "(:maxBudget IS NULL OR p.budget <= :maxBudget) AND " +
           "(:location IS NULL OR p.location ILIKE '%' || :location || '%') AND " +
           "(:biddingType IS NULL OR p.bidding_type = :biddingType) AND " +
           "(:search IS NULL OR p.title ILIKE '%' || :search || '%' OR p.description ILIKE '%' || :search || '%') AND " +
           "(p.is_deleted = false OR p.is_deleted IS NULL) AND (p.is_draft = false OR p.is_draft IS NULL)",
           nativeQuery = true)
    Page<Project> findWithFilters(
        @Param("category") String category,
        @Param("status") String status,
        @Param("minBudget") BigDecimal minBudget,
        @Param("maxBudget") BigDecimal maxBudget,
        @Param("location") String location,
        @Param("biddingType") String biddingType,
        @Param("search") String search,
        Pageable pageable
    );
    
    Long countByClientIdAndStatusAndIsDeletedFalse(String clientId, ProjectStatus status);
    
    List<Project> findByClientIdAndIsDraftTrueAndIsDeletedFalse(String clientId);
    
    @Query("SELECT p FROM Project p WHERE p.clientId = :clientId AND " +
           "p.status IN ('OPEN', 'ACCEPTING_BIDS', 'IN_DISCUSSION') AND " +
           "(p.isDeleted = false OR p.isDeleted IS NULL)")
    List<Project> findActiveProjectsByClient(@Param("clientId") String clientId);
    
    List<Project> findByDeadlineBetweenAndIsDeletedFalseAndIsDraftFalse(
        LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END " +
           "FROM Project p WHERE p.id = :projectId AND p.clientId = :clientId")
    boolean existsByIdAndClientId(
        @Param("projectId") String projectId, 
        @Param("clientId") String clientId);
}