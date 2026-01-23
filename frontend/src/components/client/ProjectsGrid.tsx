import ProjectCard from './ProjectCard';
import type { Project } from '../../types/project';

interface ProjectsGridProps {
  projects: Project[];
  onViewBids: (project: Project) => void;
}

export default function ProjectsGrid({ projects, onViewBids }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-6 text-lg">
          No projects found
        </div>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          You haven't posted any projects yet. Use the "Post New Project" button above to get started and connect with talented service providers.
        </p>
        {/* Removed the duplicate button - users should use the one in QuickActionsBar */}
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