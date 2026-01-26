import { useState } from 'react';
import {
  DashboardHeader,
  DashboardStats,
  QuickActionsBar,
  ProjectsGrid,
  PostProjectModal,
  ViewBidsPanel
} from '@/components/client';
import { useClientStore } from '../../store/useClientStore';
import type { Project, CreateProjectData, ProjectFilter } from '../../types/project';

export default function ClientAnalytics() {
  const { 
    isLoading, 
    error
  } = useClientStore();
  
  const [showPostProjectModal, setShowPostProjectModal] = useState(false);
  const [showViewBidsPanel, setShowViewBidsPanel] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects: Project[] = []; // TODO: Connect to real API

  // Convert analytics to dashboard stats format
  const dashboardStats = {
    totalProjects: 0,
    activeBids: 0,
    completedProjects: 0,
    averageBidAmount: 0
  };

  // TODO: Fetch data on component mount when real API is ready

  const handlePostProject = async (data: CreateProjectData) => {
    // TODO: Implement API call
    console.log('Posting project:', data);
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

  // TODO: Remove loading/error states when not using mock API
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Client Dashboard"
        subtitle="Manage your projects and track bidding progress"
      />

      <DashboardStats stats={dashboardStats} />

      <QuickActionsBar
        onPostProject={() => setShowPostProjectModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        projectFilter={projectFilter}
        onFilterChange={setProjectFilter}
      />

      <ProjectsGrid
        projects={filteredProjects}
        onViewBids={handleViewBids}
      />

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