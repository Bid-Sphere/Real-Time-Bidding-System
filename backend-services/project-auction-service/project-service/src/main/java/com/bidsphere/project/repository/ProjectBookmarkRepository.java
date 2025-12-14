package com.bidsphere.project.repository;



import com.bidsphere.project.entity.ProjectBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectBookmarkRepository extends JpaRepository<ProjectBookmark, Long> {
    
    List<ProjectBookmark> findByUserIdOrderByBookmarkedAtDesc(String userId);
    
    boolean existsByProjectIdAndUserId(String projectId, String userId);
    
    Optional<ProjectBookmark> findByProjectIdAndUserId(String projectId, String userId);
    
    Long countByProjectId(String projectId);
    
    void deleteByProjectIdAndUserId(String projectId, String userId);
}