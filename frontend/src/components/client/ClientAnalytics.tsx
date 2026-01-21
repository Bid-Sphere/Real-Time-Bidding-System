import { useState } from 'react';
import {
  DashboardHeader,
  DashboardStats,
  QuickActionsBar,
  ProjectsGrid,
  PostProjectModal,
  ViewBidsPanel
} from '@/components/client';
import type { Project, CreateProjectData, ProjectFilter } from '../../types/project';

export default function ClientAnalytics() {
  const [showPostProjectModal, setShowPostProjectModal] = useState(false);
  const [showViewBidsPanel, setShowViewBidsPanel] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects: Project[] = []; // TODO: Connect to real API

  const handlePostProject = (data: CreateProjectData) => {
    console.log('Posting project:', data);
    // TODO: Implement API call
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

  return (
    <>
      <DashboardHeader
        title="Client Dashboard"
        subtitle="Manage your projects and track bidding progress"
      />

      <DashboardStats stats={{ totalProjects: 0, activeBids: 0, completedProjects: 0 }} />

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