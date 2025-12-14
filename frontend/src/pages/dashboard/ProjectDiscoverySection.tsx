import { useEffect, useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectDetailsModal } from '@/components/projects/ProjectDetailsModal';
import { BidSubmissionModal } from '@/components/projects/BidSubmissionModal';
import type { BidFormData } from '@/components/projects/BidSubmissionModal';
import type { Project, FilterState } from '@/types/organization';
// Notification helpers are available for triggering notifications on events
// import { createNewProjectNotification, createBidStatusNotification } from '@/utils/notificationHelpers';

function ProjectDiscoverySection() {
  const { projects, filters, isLoading, fetchProjects, setFilters, markAsInterested, submitBid } = useProjectStore();
  const { profile } = useOrganizationStore();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);

  const isVerified = profile?.emailVerified || false;
  const organizationId = profile?.id || 'org-1'; // Fallback for development

  useEffect(() => {
    // Fetch projects on mount
    fetchProjects();
  }, [fetchProjects]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleBidClick = (project: Project) => {
    setSelectedProject(project);
    setShowBidModal(true);
  };

  const handleInterestClick = async (project: Project) => {
    try {
      await markAsInterested(project.id, organizationId);
    } catch (error) {
      console.error('Failed to mark project as interested:', error);
    }
  };

  const handleBidSubmit = async (bidData: BidFormData) => {
    if (!selectedProject) return;

    try {
      await submitBid({
        projectId: selectedProject.id,
        projectTitle: selectedProject.title,
        organizationId,
        proposedPrice: bidData.proposedPrice,
        estimatedTimeline: bidData.estimatedTimeline,
        coverLetter: bidData.coverLetter,
        attachments: [],
      });
      
      setShowBidModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Failed to submit bid:', error);
      throw error;
    }
  };

  const handleBidFromDetails = () => {
    setShowDetailsModal(false);
    setShowBidModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Project Discovery</h1>
        <p className="text-gray-400">
          Browse and bid on projects that match your expertise
        </p>
      </div>

      {/* Filters */}
      <ProjectFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-400">
            <svg
              className="animate-spin h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading projects...</span>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400">
              Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isVerified={isVerified}
                onViewDetails={() => handleViewDetails(project)}
                onBid={() => handleBidClick(project)}
                onInterest={() => handleInterestClick(project)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-white/5 rounded-full p-6 mb-4">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Projects Found
          </h3>
          <p className="text-gray-400 text-center max-w-md">
            No projects match your current filters. Try adjusting your search criteria or clearing filters.
          </p>
        </div>
      )}

      {/* Modals */}
      {selectedProject && (
        <>
          <ProjectDetailsModal
            project={selectedProject}
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedProject(null);
            }}
            onBid={handleBidFromDetails}
            isVerified={isVerified}
          />

          <BidSubmissionModal
            project={selectedProject}
            isOpen={showBidModal}
            onClose={() => {
              setShowBidModal(false);
              setSelectedProject(null);
            }}
            onSubmit={handleBidSubmit}
            isVerified={isVerified}
          />
        </>
      )}
    </div>
  );
}


export default ProjectDiscoverySection;
