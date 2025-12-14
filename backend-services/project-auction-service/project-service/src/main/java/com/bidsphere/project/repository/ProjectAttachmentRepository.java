package com.bidsphere.project.repository;



import com.bidsphere.project.entity.ProjectAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectAttachmentRepository extends JpaRepository<ProjectAttachment, String> {
    
    List<ProjectAttachment> findByProjectId(String projectId);
    
    Optional<ProjectAttachment> findByIdAndProjectId(String attachmentId, String projectId);
    
    Long countByProjectId(String projectId);
    
    void deleteByProjectId(String projectId);
}
