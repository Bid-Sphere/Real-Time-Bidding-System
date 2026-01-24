import { useState, useEffect } from 'react';
import {
  DashboardHeader,
  DashboardStats,
  QuickActionsBar,
  ProjectsGrid,
  PostProjectModal,
  ViewBidsPanel
} from '@/components/client';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import { useClientStore } from '../../store/useClientStore';
import type { Project, CreateProjectData, ProjectFilter } from '../../types/project';

export default function ClientAnalytics() {
  const { 
    projects, 
    analytics, 
    isLoading, 
    error,
    fetchProjects, 
    fetchAnalytics, 
    createProject 
  } = useClientStore();
  
  const [showPostProjectModal, setShowPostProjectModal] = useState(false);
  const [showViewBidsPanel, setShowViewBidsPanel] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Convert ClientProject[] to Project[] for compatibility with existing components
  const convertedProjects: Project[] = projects?.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category as any,
    description: p.description,
    budget: p.budget,
    deadline: new Date(p.deadline),
    status: p.status as any,
    biddingType: p.biddingType,
    visibility: p.visibility,
    location: p.location,
    requiredSkills: p.requiredSkills,
    attachments: (p.attachments || []).map(att => ({
      id: att.id,
      filename: att.filename,
      url: att.url,
      size: att.size,
      type: att.mimeType
    })),
    bidCount: p.bidCount,
    createdAt: new Date(p.postedAt),
    updatedAt: new Date(p.updatedAt),
    clientId: p.clientId,
    isStrictDeadline: p.isStrictDeadline,
    biddingEndDate: new Date(p.biddingEndDate)
  })) || [];

  const filteredProjects = useProjectFilters(convertedProjects, projectFilter, searchQuery);

  // Convert analytics to dashboard stats format
  const dashboardStats = analytics ? {
    totalProjects: analytics.totalProjects,
    activeBids: analytics.activeProjects,
    completedProjects: analytics.completedProjects,
    averageBidAmount: analytics.averageBidAmount
  } : {
    totalProjects: 0,
    activeBids: 0,
    completedProjects: 0,
    averageBidAmount: 0
  };

  // Fetch data on component mount
  useEffect(() => {
    const clientId = 'client-1'; // Using mock client ID
    try {
      fetchProjects(clientId);
      fetchAnalytics(clientId);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  }, [fetchProjects, fetchAnalytics]);

  const handlePostProject = async (data: CreateProjectData) => {
    try {
      const clientId = 'client-1'; // Using mock client ID
      const newProject = await createProject(clientId, data);
      
      // Show success message
      alert(`Project "${newProject.title}" created successfully!`);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert(`Failed to create project: ${error.message}`);
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
        onPostProject={() => setShowPostProjectModal(true)}
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