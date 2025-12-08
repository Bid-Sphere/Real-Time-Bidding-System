import { create } from 'zustand';
import type { Project, FilterState, Bid } from '@/types/organization';
import { mockApiService } from '@/mocks/mockApiService';

interface ProjectState {
  projects: Project[];
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  
  // Actions
  fetchProjects: (filters?: FilterState, page?: number) => Promise<void>;
  setFilters: (filters: FilterState) => void;
  markAsInterested: (projectId: string, organizationId: string) => Promise<void>;
  submitBid: (bid: Omit<Bid, 'id' | 'submittedAt' | 'updatedAt' | 'status' | 'ranking'>) => Promise<void>;
  getProject: (projectId: string) => Promise<Project>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  filters: {},
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 0,

  fetchProjects: async (filters?: FilterState, page: number = 1) => {
    set({ isLoading: true, error: null });
    try {
      const filtersToUse = filters || get().filters;
      const result = await mockApiService.projects.getProjects(filtersToUse, page);
      set({ 
        projects: result.projects,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch projects', 
        isLoading: false 
      });
    }
  },

  setFilters: (filters: FilterState) => {
    set({ filters });
    // Automatically fetch projects with new filters
    get().fetchProjects(filters, 1);
  },

  markAsInterested: async (projectId: string, organizationId: string) => {
    set({ isLoading: true, error: null });
    try {
      await mockApiService.projects.markAsInterested(projectId, organizationId);
      
      // Update the project in the local state
      const projects = get().projects.map(p => 
        p.id === projectId ? { ...p, isInterested: true } : p
      );
      
      set({ projects, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark project as interested', 
        isLoading: false 
      });
      throw error;
    }
  },

  submitBid: async (bid: Omit<Bid, 'id' | 'submittedAt' | 'updatedAt' | 'status' | 'ranking'>) => {
    set({ isLoading: true, error: null });
    try {
      await mockApiService.bids.submitBid(bid);
      
      // Update the project in the local state to increment bid count and set hasBid flag
      const projects = get().projects.map(p => 
        p.id === bid.projectId 
          ? { ...p, bidCount: p.bidCount + 1, hasBid: true } 
          : p
      );
      
      set({ projects, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit bid';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  getProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await mockApiService.projects.getProject(projectId);
      set({ isLoading: false });
      return project;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch project', 
        isLoading: false 
      });
      throw error;
    }
  },
}));
