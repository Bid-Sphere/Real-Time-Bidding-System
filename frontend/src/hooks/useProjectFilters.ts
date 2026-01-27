import { useMemo } from 'react';
import type { Project, ProjectFilter } from '../types/project';

export function useProjectFilters(projects: Project[], filter: ProjectFilter, searchQuery: string) {
  return useMemo(() => {
    return projects.filter(project => {
      const matchesFilter = filter === 'all' || 
        (filter === 'active' && ['OPEN', 'ACCEPTING_BIDS'].includes(project.status)) ||
        (filter === 'in_discussion' && project.status === 'IN_DISCUSSION') ||
        (filter === 'closed' && ['CLOSED', 'IN_PROGRESS', 'COMPLETED'].includes(project.status));
      
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, searchQuery]);
}