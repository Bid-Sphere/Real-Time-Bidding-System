import { create } from 'zustand';
import type { Project, FilterState, Bid } from '@/types/organization';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Helper: Map backend status to frontend status
const mapBackendStatusToFrontend = (backendStatus: string): Project['status'] => {
  const statusMap: Record<string, Project['status']> = {
    'OPEN': 'open',
    'ACCEPTING_BIDS': 'in_bidding',
    'IN_DISCUSSION': 'in_bidding',
    'IN_PROGRESS': 'awarded',
    'COMPLETED': 'completed',
    'CLOSED': 'cancelled',
    'DRAFT': 'cancelled'
  };
  return statusMap[backendStatus] || 'open';
};

// Helper: Map backend project to organization Project type
const mapBackendProjectToOrganizationProject = (backendProject: any): Project => {
  return {
    id: backendProject.id,
    title: backendProject.title,
    description: backendProject.description,
    category: backendProject.category,
    tags: [], // Not provided by backend, set empty array
    budgetMin: backendProject.budget,
    budgetMax: backendProject.budget,
    deadline: backendProject.deadline,
    clientId: backendProject.clientId,
    clientName: backendProject.clientName,
    clientAvatar: undefined,
    requirements: backendProject.requiredSkills || [],
    attachments: backendProject.attachments || [],
    bidCount: backendProject.bidCount || 0,
    status: mapBackendStatusToFrontend(backendProject.status),
    location: backendProject.location,
    postedAt: backendProject.createdAt,
    isInterested: false,
    hasBid: false
  };
};

// Helper: Map FilterState to query parameters
const mapFiltersToQueryParams = (filters: FilterState, page: number): URLSearchParams => {
  const params = new URLSearchParams();
  
  // Convert frontend page (1-based) to backend page (0-based)
  params.append('page', (page - 1).toString());
  params.append('limit', '20');
  
  if (filters.category) {
    params.append('category', filters.category);
  }
  
  if (filters.budgetMin !== undefined) {
    params.append('minBudget', filters.budgetMin.toString());
  }
  
  if (filters.budgetMax !== undefined) {
    params.append('maxBudget', filters.budgetMax.toString());
  }
  
  if (filters.location) {
    params.append('location', filters.location);
  }
  
  if (filters.searchQuery) {
    params.append('search', filters.searchQuery);
  }
  
  // Map deadline filter to sort parameter
  if (filters.deadline === 'urgent') {
    params.append('sort', 'deadline_urgent');
  }
  
  return params;
};

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
      const currentFilters = filters || get().filters;
      const queryParams = mapFiltersToQueryParams(currentFilters, page);
      
      const response = await fetch(`${API_BASE_URL}/api/projects?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch projects');
      }
      
      let projects = result.data.content.map(mapBackendProjectToOrganizationProject);
      
      // Filter out expired projects unless showExpired is true
      if (!currentFilters.showExpired) {
        const now = new Date();
        projects = projects.filter((project: Project) => {
          const deadline = new Date(project.deadline);
          return deadline >= now;
        });
      }
      
      set({ 
        projects,
        total: projects.length, // Update total to reflect filtered count
        totalPages: Math.ceil(projects.length / 20),
        page,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch projects', 
        isLoading: false,
        projects: [],
        total: 0,
        totalPages: 0
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
      // TODO: Implement when bidding service is available
      throw new Error('Bidding service not implemented yet');
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
      // TODO: Implement when bidding service is available
      throw new Error('Bidding service not implemented yet');
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
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch project');
      }
      
      const project = mapBackendProjectToOrganizationProject(result.data);
      
      // Track the view (fire and forget, no auth required)
      fetch(`${API_BASE_URL}/api/projects/${projectId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {
        // Silently fail if view tracking fails
      });
      
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
