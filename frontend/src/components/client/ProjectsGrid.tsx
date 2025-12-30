import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProjectCard from './ProjectCard';
import type { Project } from '../../types/project';

interface ProjectsGridProps {
  projects: Project[];
  onViewBids: (project: Project) => void;
  onPostProject: () => void;
}

export default function ProjectsGrid({ projects, onViewBids, onPostProject }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-[var(--text-secondary)] mb-4">
          No projects found matching your criteria
        </div>
        <Button onClick={onPostProject}>
          <Plus className="h-4 w-4 mr-2" />
          Post Your First Project
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onViewBids={onViewBids}
        />
      ))}
    </div>
  );
}