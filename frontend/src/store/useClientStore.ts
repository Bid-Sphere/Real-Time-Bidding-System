import { create } from 'zustand';
import type { ClientProfile, ClientAnalyticsData, ClientProject } from '../types/client';
import { mockApiService } from '../mocks/mockApiService';

interface ClientState {
  profile: ClientProfile | null;
  analytics: ClientAnalyticsData | null;
  projects: ClientProject[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: (clientId: string) => Promise<void>;
  updateProfile: (clientId: string, data: Partial<ClientProfile>) => Promise<void>;
  fetchAnalytics: (clientId: string) => Promise<void>;
  sendVerificationCode: (clientId: string) => Promise<{ message: string; expiresAt: string }>;
  verifyCode: (clientId: string, code: string) => Promise<{ verified: boolean; message: string }>;
  
  // Project actions
  fetchProjects: (clientId: string) => Promise<void>;
  createProject: (clientId: string, projectData: any) => Promise<ClientProject>;
  updateProject: (projectId: string, updates: Partial<ClientProject>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  profile: null,
  analytics: null,
  projects: [],
  isLoading: false,
  error: null,

  fetchProfile: async (clientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await mockApiService.client.getProfile(clientId);
      set({ profile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile', 
        isLoading: false 
      });
    }
  },

  updateProfile: async (clientId: string, data: Partial<ClientProfile>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await mockApiService.client.updateProfile(clientId, data);
      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile', 
        isLoading: false 
      });
    }
  },

  fetchAnalytics: async (clientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const analytics = await mockApiService.client.getAnalytics(clientId);
      set({ analytics, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch analytics', 
        isLoading: false 
      });
    }
  },

  sendVerificationCode: async (clientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await mockApiService.client.sendVerificationCode(clientId);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to send verification code', 
        isLoading: false 
      });
      throw error;
    }
  },

  verifyCode: async (clientId: string, code: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await mockApiService.client.verifyCode(clientId, code);
      
      // If verification successful, refresh profile to get updated emailVerified status
      if (result.verified) {
        const profile = await mockApiService.client.getProfile(clientId);
        set({ profile, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      
      return result;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to verify code', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Project management functions
  fetchProjects: async (clientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const projects = await mockApiService.client.getProjects(clientId);
      set({ projects, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch projects', 
        isLoading: false 
      });
    }
  },

  createProject: async (clientId: string, projectData: any) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await mockApiService.client.createProject(clientId, projectData);
      const currentProjects = get().projects;
      set({ 
        projects: [newProject, ...currentProjects], 
        isLoading: false 
      });
      return newProject;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create project', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateProject: async (projectId: string, updates: Partial<ClientProject>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await mockApiService.client.updateProject(projectId, updates);
      const currentProjects = get().projects;
      const updatedProjects = currentProjects.map(p => 
        p.id === projectId ? updatedProject : p
      );
      set({ projects: updatedProjects, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update project', 
        isLoading: false 
      });
    }
  },

  deleteProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      await mockApiService.client.deleteProject(projectId);
      const currentProjects = get().projects;
      const filteredProjects = currentProjects.filter(p => p.id !== projectId);
      set({ projects: filteredProjects, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete project', 
        isLoading: false 
      });
    }
  },
}));