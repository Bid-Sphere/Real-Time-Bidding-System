import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useClientProfileCompletion } from '../../hooks/useClientProfileCompletion';
import { ProfileCompletionModal } from './ProfileCompletionModal';
import type { ProjectFilter } from '../../types/project';

interface QuickActionsBarProps {
  onPostProject: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  projectFilter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
}

export default function QuickActionsBar({
  onPostProject,
  searchQuery,
  onSearchChange,
  projectFilter,
  onFilterChange
}: QuickActionsBarProps) {
  const { isComplete, profile } = useClientProfileCompletion();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handlePostProject = () => {
    if (!isComplete) {
      setShowProfileModal(true);
      return;
    }
    onPostProject();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePostProject}
            className="bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Project
          </Button>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="w-64"
            />
            
            <Select
              options={[
                { value: 'all', label: 'All Projects' },
                { value: 'active', label: 'Active' },
                { value: 'in_discussion', label: 'In Discussion' },
                { value: 'closed', label: 'Closed' }
              ]}
              value={projectFilter}
              onChange={(e) => onFilterChange(e.target.value as ProjectFilter)}
            />
          </div>
        </div>
      </div>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        actionAttempted="post a project"
      />
    </>
  );
}