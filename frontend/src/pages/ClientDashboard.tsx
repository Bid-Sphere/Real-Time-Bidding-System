import { useState } from 'react';
import Footer from '@/components/layout/Footer';
import {
  DashboardNavbar,
  ClientSidebar,
  DashboardHeader,
  DashboardStats,
  QuickActionsBar,
  ProjectsGrid,
  PostProjectModal,
  ViewBidsPanel
} from '@/components/client';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import { mockStats, mockProjects } from '@/data/mockData';
import type { Project, CreateProjectData, ProjectFilter } from '../types/project';

export default function ClientDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showPostProjectModal, setShowPostProjectModal] = useState(false);
  const [showViewBidsPanel, setShowViewBidsPanel] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useProjectFilters(mockProjects, projectFilter, searchQuery);

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
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Dashboard-specific Header/Navbar */}
      <DashboardNavbar />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <ClientSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onPostProject={() => setShowPostProjectModal(true)}
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            <DashboardHeader
              title="Client Dashboard"
              subtitle="Manage your projects and track bidding progress"
            />

            <DashboardStats stats={mockStats} />

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
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

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
    </div>
  );
}