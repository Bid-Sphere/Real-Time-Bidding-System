import { create } from 'zustand';
import type { ClientProfile, ClientAnalyticsData } from '../types/client';
import { mockApiService } from '@/mocks/mockApiService';

interface ClientState {
  profile: ClientProfile | null;
  analytics: ClientAnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: (clientId: string) => Promise<void>;
  updateProfile: (clientId: string, data: Partial<ClientProfile>) => Promise<void>;
  fetchAnalytics: (clientId: string) => Promise<void>;
  sendVerificationCode: (clientId: string) => Promise<{ message: string; expiresAt: string }>;
  verifyCode: (clientId: string, code: string) => Promise<{ verified: boolean; message: string }>;
}

export const useClientStore = create<ClientState>((set) => ({
  profile: null,
  analytics: null,
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
}));