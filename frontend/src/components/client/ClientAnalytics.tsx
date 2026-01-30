import { useState, useEffect } from 'react';
import {
  DashboardHeader,
  DashboardStats,
  QuickActionsBar,
  ProjectsGrid,
  PostProjectModal,
  ViewBidsPanel
} from '@/components/client';
import { useClientStore } from '../../store/useClientStore';
import { useClientProjectStore } from '../../store/useClientProjectStore';
import { useBidStore } from '../../store/useBidStore';
import { projectApiService } from '@/services/projectApiService';
import { showSuccessToast, showErrorToast, formatErrorMessage } from '@/utils/toast';
import type { Project, CreateProjectData, ProjectFilter } from '../../types/project';

export default function ClientAnalytics() {
  const { 
    isLoading: profileLoading, 
    error: profileError
  } = useClientStore();
  
  const {
    projects,
    stats,
    isLoading: projectsLoading,
    error: projectsError,
    createProject,
    fetchMyProjects,
    fetchClientStats
  } = useClientProjectStore();
  
  const { acceptBid, rejectBid, fetchBidsForProject } = useBidStore();
  
  const [showPostProjectModal, setShowPostProjectModal] = useState(false);
  const [showViewBidsPanel, setShowViewBidsPanel] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectsWithBidCounts, setProjectsWithBidCounts] = useState<Project[]>([]);

  // Fetch projects and stats on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchMyProjects();
      await fetchClientStats();
    };
    loadData();
  }, [fetchMyProjects, fetchClientStats]);

  // Fetch bid counts for all projects
  useEffect(() => {
    const fetchBidCounts = async () => {
      if (projects.length === 0) {
        setProjectsWithBidCounts([]);
        return;
      }

      const projectsWithCounts = await Promise.all(
        projects.map(async (project) => {
          try {
            const bidsResult = await fetchBidsForProject(project.id);
            return {
              ...project,
              bidCount: bidsResult.totalElements || 0
            };
          } catch (error) {
            console.error(`Failed to fetch bid count for project ${project.id}:`, error);
            return project; // Return project with original bidCount on error
          }
        })
      );

      setProjectsWithBidCounts(projectsWithCounts);
    };

    fetchBidCounts();
  }, [projects, fetchBidsForProject]);

  const filteredProjects = projectsWithBidCounts; // Use projects with updated bid counts

  // Convert analytics to dashboard stats format (always show template with zero values if no data)
  const dashboardStats = {
    totalProjects: stats?.totalProjects ?? 0,
    activeBids: stats?.activeProjects ?? 0,
    completedProjects: stats?.completedProjects ?? 0,
    averageBidAmount: 0
  };

  const handlePostProject = async (data: CreateProjectData) => {
    try {
      await createProject(data);
      setShowPostProjectModal(false);
      showSuccessToast('Project created successfully');
      fetchMyProjects();
      fetchClientStats();
    } catch (error) {
      console.error('Failed to create project:', error);
      showErrorToast('Failed to create project');
    }
  };

  const handleViewBids = (project: Project) => {
    setSelectedProject(project);
    setShowViewBidsPanel(true);
  };

  const handleAcceptBid = async (bidId: string) => {
    if (!selectedProject) return;
    
    try {
      // Accept the bid
      await acceptBid(bidId);
      
      // Update project status to IN_PROGRESS
      await projectApiService.updateProjectStatus(selectedProject.id, 'IN_PROGRESS');
      
      showSuccessToast('Bid accepted successfully! Project status updated to In Progress.');
      
      // Close panel first to avoid re-render issues
      setShowViewBidsPanel(false);
      setSelectedProject(null);
      
      // Then refresh projects and stats
      await fetchMyProjects();
      await fetchClientStats();
    } catch (error) {
      console.error('Error accepting bid:', error);
      const errorMessage = formatErrorMessage(error);
      showErrorToast(`Failed to accept bid: ${errorMessage}`);
    }
  };

  const handleRejectBid = async (bidId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    try {
      await rejectBid(bidId, reason || undefined);
      showSuccessToast('Bid rejected successfully');
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      showErrorToast(`Failed to reject bid: ${errorMessage}`);
    }
  };

  const handleOpenChat = (bidderId: string) => {
    console.log('Opening chat with:', bidderId);
    showSuccessToast('Chat feature coming soon!');
  };

  const handleViewProfile = (bidderId: string) => {
    console.log('Viewing profile:', bidderId);
    showSuccessToast('Profile view coming soon!');
  };

  const isLoading = profileLoading || projectsLoading;
  const error = profileError || projectsError;

  return (
    <>
      <DashboardHeader
        title="Client Dashboard"
        subtitle="Manage your projects and track bidding progress"
      />

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
          <button 
            onClick={() => {
              fetchMyProjects();
              fetchClientStats();
            }}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
          >
            Retry
          </button>
        </div>
      )}

      <DashboardStats stats={dashboardStats} />

      <QuickActionsBar
        onPostProject={() => setShowPostProjectModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        projectFilter={projectFilter}
        onFilterChange={setProjectFilter}
      />

      {isLoading && projectsWithBidCounts.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading projects...</p>
          </div>
        </div>
      ) : (
        <ProjectsGrid
          projects={filteredProjects}
          onViewBids={handleViewBids}
        />
      )}

      {/* Modals */}
      <PostProjectModal
        isOpen={showPostProjectModal}
        onClose={() => setShowPostProjectModal(false)}
        onSubmit={handlePostProject}
      />

      {selectedProject && (
        <ViewBidsPanel
          isOpen={showViewBidsPanel}
          onClose={() => setShowViewBidsPanel(false)}
          project={selectedProject}
          onAcceptBid={handleAcceptBid}
          onRejectBid={handleRejectBid}
          onOpenChat={handleOpenChat}
          onViewProfile={handleViewProfile}
        />
      )}
    </>
  );
}