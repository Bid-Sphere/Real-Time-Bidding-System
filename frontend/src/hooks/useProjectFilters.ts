import { useMemo } from 'react';
import type { Project, ProjectFilter } from '@/types/project';

export function useProjectFilters(projects: Project[], filter: ProjectFilter, searchQuery: string) {
  return useMemo(() => {
    return projects.filter(project => {
      const matchesFilter = filter === 'all' || 
        (filter === 'active' && ['open_for_bidding', 'accepting_bids'].includes(project.status)) ||
        (filter === 'in_discussion' && project.status === 'in_discussion') ||
        (filter === 'closed' && ['closed_for_bidding', 'awarded', 'completed'].includes(project.status));
      
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, searchQuery]);
}