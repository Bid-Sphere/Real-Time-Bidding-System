import { create } from 'zustand';
import type { Project, FilterState, Bid } from '@/types/organization';

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

  fetchProjects: async (_filters?: FilterState, _page: number = 1) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call
      throw new Error('Backend API not connected yet');
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

  markAsInterested: async (_projectId: string, _organizationId: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call
      throw new Error('Backend API not connected yet');
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark project as interested', 
        isLoading: false 
      });
      throw error;
    }
  },

  submitBid: async (_bid: Omit<Bid, 'id' | 'submittedAt' | 'updatedAt' | 'status' | 'ranking'>) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call
      throw new Error('Backend API not connected yet');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit bid';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  getProject: async (_projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call
      throw new Error('Backend API not connected yet');
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch project', 
        isLoading: false 
      });
      throw error;
    }
  },
}));
