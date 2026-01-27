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
  
  const [showPostProjectModal, setShowPostProjectModal] = useState(false);
  const [showViewBidsPanel, setShowViewBidsPanel] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch projects and stats on mount
  useEffect(() => {
    fetchMyProjects();
    fetchClientStats();
  }, [fetchMyProjects, fetchClientStats]);

  const filteredProjects = projects; // TODO: Add client-side filtering if needed

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
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleViewBids = (project: Project) => {
    setSelectedProject(project);
    setShowViewBidsPanel(true);
  };

  const handleAcceptBid = (bidId: string) => {
    console.log('Accepting bid:', bidId);
    // TODO: Implement API call
  };

  const handleRejectBid = (bidId: string) => {
    console.log('Rejecting bid:', bidId);
    // TODO: Implement API call
  };

  const handleOpenChat = (bidderId: string) => {
    console.log('Opening chat with:', bidderId);
    // TODO: Implement chat functionality
  };

  const handleViewProfile = (bidderId: string) => {
    console.log('Viewing profile:', bidderId);
    // TODO: Implement profile view
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

      {isLoading && projects.length === 0 ? (
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
          bids={[]}
          onAcceptBid={handleAcceptBid}
          onRejectBid={handleRejectBid}
          onOpenChat={handleOpenChat}
          onViewProfile={handleViewProfile}
        />
      )}
    </>
  );
}