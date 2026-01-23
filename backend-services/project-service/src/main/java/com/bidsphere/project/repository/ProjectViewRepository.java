package com.bidsphere.project.repository;


import com.bidsphere.project.entity.ProjectView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProjectViewRepository extends JpaRepository<ProjectView, Long> {
    
    Long countByProjectId(String projectId);
    
    @Query("SELECT COUNT(DISTINCT pv.userId) FROM ProjectView pv WHERE " +
           "pv.projectId = :projectId AND pv.userId IS NOT NULL")
    Long countUniqueViewsByProjectId(@Param("projectId") String projectId);
    
    boolean existsByProjectIdAndUserId(String projectId, String userId);
    
    boolean existsByProjectIdAndSessionId(String projectId, String sessionId);
    
    @Query("SELECT pv FROM ProjectView pv WHERE pv.projectId = :projectId AND " +
           "pv.viewedAt BETWEEN :startDate AND :endDate ORDER BY pv.viewedAt DESC")
    List<ProjectView> findViewsByDateRange(
        @Param("projectId") String projectId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
