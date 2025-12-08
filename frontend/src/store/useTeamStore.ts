import { create } from 'zustand';
import type { TeamMember } from '@/types/organization';
import { mockApiService } from '@/mocks/mockApiService';

interface TeamState {
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTeamMembers: (orgId: string) => Promise<void>;
  addTeamMember: (orgId: string, data: Omit<TeamMember, 'id' | 'organizationId' | 'createdAt'>) => Promise<void>;
  updateTeamMember: (orgId: string, memberId: string, data: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (orgId: string, memberId: string) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  isLoading: false,
  error: null,

  fetchTeamMembers: async (orgId: string) => {
    set({ isLoading: true, error: null });
    try {
      const members = await mockApiService.teams.getTeamMembers(orgId);
      set({ members, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch team members', 
        isLoading: false 
      });
    }
  },

  addTeamMember: async (orgId: string, data: Omit<TeamMember, 'id' | 'organizationId' | 'createdAt'>) => {
    set({ isLoading: true, error: null });
    try {
      const newMember = await mockApiService.teams.addTeamMember(orgId, data);
      set((state) => ({ 
        members: [...state.members, newMember], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add team member', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateTeamMember: async (orgId: string, memberId: string, data: Partial<TeamMember>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedMember = await mockApiService.teams.updateTeamMember(orgId, memberId, data);
      set((state) => ({
        members: state.members.map(m => m.id === memberId ? updatedMember : m),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update team member', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteTeamMember: async (orgId: string, memberId: string) => {
    set({ isLoading: true, error: null });
    try {
      await mockApiService.teams.deleteTeamMember(orgId, memberId);
      set((state) => ({
        members: state.members.filter(m => m.id !== memberId),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete team member', 
        isLoading: false 
      });
      throw error;
    }
  },
}));
