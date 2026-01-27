import { create } from 'zustand';
import type { Project, CreateProjectData } from '@/types/project';
import projectApiService from '@/services/projectApiService';

interface ClientProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  stats: {
    totalProjects: number;
    activeProjects: number;
    draftProjects: number;
    completedProjects: number;
  } | null;
  
  // Actions
  createProject: (data: CreateProjectData) => Promise<Project>;
  fetchMyProjects: (status?: string, page?: number) => Promise<void>;
  fetchProjectById: (projectId: string) => Promise<void>;
  updateProject: (projectId: string, data: Partial<CreateProjectData>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  updateProjectStatus: (projectId: string, status: string, reason?: string) => Promise<void>;
  publishProject: (projectId: string) => Promise<void>;
  fetchClientStats: () => Promise<void>;
  clearError: () => void;
}

export const useClientProjectStore = create<ClientProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  total: 0,
  stats: {
    totalProjects: 0,
    activeProjects: 0,
    draftProjects: 0,
    completedProjects: 0
  },

  createProject: async (data: CreateProjectData) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectApiService.createProject(data);
      
      // Add to projects list
      set(state => ({
        projects: [project, ...state.projects],
        isLoading: false
      }));
      
      // Refresh stats
      get().fetchClientStats();
      
      return project;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchMyProjects: async (status?: string, page: number = 0) => {
    set({ isLoading: true, error: null });
    try {
      const { projects, total } = await projectApiService.getMyProjects(status, page, 20);
      set({ projects, total, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
      set({ error: errorMessage, isLoading: false, projects: [] });
    }
  },

  fetchProjectById: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectApiService.getProjectById(projectId);
      set({ currentProject: project, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project';
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateProject: async (projectId: string, data: Partial<CreateProjectData>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await projectApiService.updateProject(projectId, data);
      
      // Update in projects list
      set(state => ({
        projects: state.projects.map(p => p.id === projectId ? updatedProject : p),
        currentProject: state.currentProject?.id === projectId ? updatedProject : state.currentProject,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      await projectApiService.deleteProject(projectId);
      
      // Remove from projects list
      set(state => ({
        projects: state.projects.filter(p => p.id !== projectId),
        isLoading: false
      }));
      
      // Refresh stats
      get().fetchClientStats();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateProjectStatus: async (projectId: string, status: string, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await projectApiService.updateProjectStatus(projectId, status, reason);
      
      // Update in projects list
      set(state => ({
        projects: state.projects.map(p => p.id === projectId ? updatedProject : p),
        currentProject: state.currentProject?.id === projectId ? updatedProject : state.currentProject,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project status';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  publishProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const publishedProject = await projectApiService.publishProject(projectId);
      
      // Update in projects list
      set(state => ({
        projects: state.projects.map(p => p.id === projectId ? publishedProject : p),
        currentProject: state.currentProject?.id === projectId ? publishedProject : state.currentProject,
        isLoading: false
      }));
      
      // Refresh stats
      get().fetchClientStats();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish project';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchClientStats: async () => {
    try {
      const stats = await projectApiService.getClientStats();
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch client stats:', error);
      // Set default zero values on error
      set({ 
        stats: {
          totalProjects: 0,
          activeProjects: 0,
          draftProjects: 0,
          completedProjects: 0
        }
      });
    }
  },

  clearError: () => set({ error: null }),
}));
