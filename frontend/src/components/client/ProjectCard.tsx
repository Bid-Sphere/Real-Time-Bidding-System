import { Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onViewBids: (project: Project) => void;
}

export default function ProjectCard({ project, onViewBids }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open_for_bidding':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'accepting_bids':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_discussion':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'closed_for_bidding':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'awarded':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open_for_bidding':
        return '🟢 Open for Bidding';
      case 'accepting_bids':
        return '🔵 Accepting Bids';
      case 'in_discussion':
        return '🟡 In Discussion';
      case 'closed_for_bidding':
        return '⚫ Closed for Bidding';
      case 'awarded':
        return '🟣 Awarded';
      case 'completed':
        return '✅ Completed';
      default:
        return status;
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 line-clamp-2">
            {project.title}
          </h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusText(project.status)}
          </span>
        </div>
        <span className="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-full text-xs font-medium">
          {project.category}
        </span>
      </div>

      <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">
        {project.description}
      </p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Budget:</span>
          <span className="font-semibold text-[var(--text-primary)]">
            ${project.budget.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Deadline:</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {project.deadline.toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Bids:</span>
          <span className="font-semibold text-[var(--accent-blue)]">
            {project.bidCount} received
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewBids(project)}
          className="flex-1"
        >
          View Bids
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-3"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}