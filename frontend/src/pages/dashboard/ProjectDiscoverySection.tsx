import { useEffect, useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useBidStore } from '@/store/useBidStore';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectDetailsModal } from '@/components/projects/ProjectDetailsModal';
import { BidSubmissionModal } from '@/components/projects/BidSubmissionModal';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import type { BidFormData } from '@/components/projects/BidSubmissionModal';
import type { Project, FilterState } from '@/types/organization';
// Notification helpers are available for triggering notifications on events
// import { createNewProjectNotification, createBidStatusNotification } from '@/utils/notificationHelpers';

function ProjectDiscoverySection() {
  const { projects, filters, isLoading, total, page, totalPages, fetchProjects, setFilters, markAsInterested } = useProjectStore();
  const { submitBid, fetchBidsForProject } = useBidStore();
  const { profile } = useOrganizationStore();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [projectsWithBidCounts, setProjectsWithBidCounts] = useState<Project[]>([]);
  const [biddedProjectIds, setBiddedProjectIds] = useState<Set<string>>(new Set());

  const isVerified = profile?.emailVerified || false;
  // Use userId from profile, not the profile id
  const userId = profile?.userId || profile?.id || 'org-1';

  useEffect(() => {
    // Fetch projects on mount
    fetchProjects();
  }, [fetchProjects]);

  // Fetch bid counts for all projects and check if user has already bid
  useEffect(() => {
    const fetchBidCounts = async () => {
      if (projects.length === 0) {
        setProjectsWithBidCounts([]);
        setBiddedProjectIds(new Set());
        return;
      }

      const biddedIds = new Set<string>();
      const projectsWithCounts = await Promise.all(
        projects.map(async (project) => {
          try {
            const bidsResult = await fetchBidsForProject(project.id);
            
            // Check if any bid belongs to current organization
            // Compare both as strings since bidderId might be stored as string number
            const userBid = bidsResult.content.find(bid => 
              String(bid.bidderId) === String(userId) || 
              bid.bidderId === userId
            );
            
            if (userBid) {
              biddedIds.add(project.id);
              console.log(`User has already bid on project: ${project.title}`, userBid);
            }
            
            return {
              ...project,
              bidCount: bidsResult.totalElements || 0
            };
          } catch (error) {
            console.error(`Failed to fetch bid count for project ${project.id}:`, error);
            return project;
          }
        })
      );

      console.log('Bidded project IDs:', Array.from(biddedIds));
      console.log('Current user ID:', userId);
      setProjectsWithBidCounts(projectsWithCounts);
      setBiddedProjectIds(biddedIds);
    };

    fetchBidCounts();
  }, [projects, fetchBidsForProject, userId]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleBidClick = (project: Project) => {
    // Check if project deadline has passed
    const deadline = new Date(project.deadline);
    const now = new Date();
    
    if (deadline < now) {
      // Project is expired
      showErrorToast('This project has expired and is no longer accepting bids');
      return;
    }
    
    setSelectedProject(project);
    setShowBidModal(true);
  };

  const handleInterestClick = async (project: Project) => {
    try {
      await markAsInterested(project.id, userId);
    } catch (error) {
      console.error('Failed to mark project as interested:', error);
    }
  };

  const handleBidSubmit = async (bidData: BidFormData) => {
    if (!selectedProject) return;

    try {
      // Calculate estimated duration in days from the selected date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const completionDate = new Date(bidData.estimatedTimeline);
      completionDate.setHours(0, 0, 0, 0);
      const estimatedDuration = Math.ceil((completionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (estimatedDuration <= 0) {
        showErrorToast('Estimated completion date must be in the future');
        throw new Error('Invalid estimated duration');
      }

      await submitBid(
        selectedProject.id,
        selectedProject.clientId,
        bidData.proposedPrice,
        estimatedDuration,
        bidData.coverLetter
      );
      
      showSuccessToast('Bid submitted successfully!');
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

  const handlePageChange = (newPage: number) => {
    fetchProjects(filters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {!isLoading && projectsWithBidCounts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400">
              Showing {projectsWithBidCounts.length} of {total} project{total !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsWithBidCounts.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isVerified={isVerified}
                hasBidded={biddedProjectIds.has(project.id)}
                onViewDetails={() => handleViewDetails(project)}
                onBid={() => handleBidClick(project)}
                onInterest={() => handleInterestClick(project)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && projectsWithBidCounts.length === 0 && (
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
