import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Calendar, DollarSign, Users } from 'lucide-react';
import { DashboardHeader } from '@/components/client';
import { useClientStore } from '../../store/useClientStore';
import { useClientProfileCompletion } from '../../hooks/useClientProfileCompletion';
import { ProfileCompletionModal } from './ProfileCompletionModal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { ClientProject } from '../../types/client';

export default function ClientProjects() {
  const { isLoading } = useClientStore();
  const { isComplete, profile } = useClientProfileCompletion();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // TODO: Replace with real API call when backend is ready
  const projects: ClientProject[] = [];
  const filteredProjects = projects;

  const handleCreateProject = () => {
    if (!isComplete) {
      setShowProfileModal(true);
      return;
    }
    // Navigate to create project or open modal
    console.log('Create new project');
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      // TODO: Implement delete project API call
      console.log('Delete project:', projectId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open_for_bidding':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'accepting_bids':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_discussion':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'closed_for_bidding':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'awarded':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <>
        <DashboardHeader
          title="Projects"
          subtitle="Manage all your posted projects"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading projects...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Projects"
        subtitle="Manage all your posted projects"
      />
      
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleCreateProject}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Project
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="w-64"
          />
          
          <Select
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'open_for_bidding', label: 'Open for Bidding' },
              { value: 'accepting_bids', label: 'Accepting Bids' },
              { value: 'in_discussion', label: 'In Discussion' },
              { value: 'closed_for_bidding', label: 'Closed' },
              { value: 'awarded', label: 'Awarded' },
              { value: 'completed', label: 'Completed' }
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Projects Found</h3>
            <p className="text-gray-400 mb-6">
              {projects.length === 0 
                ? "You haven't posted any projects yet. Create your first project to get started."
                : "No projects match your current filters. Try adjusting your search or filter criteria."
              }
            </p>
            {projects.length === 0 && (
              <Button onClick={handleCreateProject}>
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {project.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {formatStatus(project.status)}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-3 mb-4">
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${project.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project.bidCount} bids</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {new Date(project.postedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Project Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-400 hover:text-red-300 hover:border-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        actionAttempted="create a project"
      />
    </>
  );
}