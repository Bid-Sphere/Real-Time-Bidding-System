import { create } from 'zustand';
import type { OrganizationProfile, AnalyticsData } from '@/types/organization';
import { mockApiService } from '@/mocks/mockApiService';

interface OrganizationState {
  profile: OrganizationProfile | null;
  analytics: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: (orgId: string) => Promise<void>;
  updateProfile: (orgId: string, data: Partial<OrganizationProfile>) => Promise<void>;
  fetchAnalytics: (orgId: string) => Promise<void>;
  sendVerificationCode: (orgId: string) => Promise<{ message: string; expiresAt: string }>;
  verifyCode: (orgId: string, code: string) => Promise<{ verified: boolean; message: string }>;
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
  profile: null,
  analytics: null,
  isLoading: false,
  error: null,

  fetchProfile: async (orgId: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await mockApiService.profile.getProfile(orgId);
      set({ profile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile', 
        isLoading: false 
      });
    }
  },

  updateProfile: async (orgId: string, data: Partial<OrganizationProfile>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await mockApiService.profile.updateProfile(orgId, data);
      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile', 
        isLoading: false 
      });
    }
  },

  fetchAnalytics: async (orgId: string) => {
    set({ isLoading: true, error: null });
    try {
      const analytics = await mockApiService.analytics.getAnalytics(orgId);
      set({ analytics, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch analytics', 
        isLoading: false 
      });
    }
  },

  sendVerificationCode: async (orgId: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await mockApiService.verification.sendVerificationCode(orgId);
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

  verifyCode: async (orgId: string, code: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await mockApiService.verification.verifyCode(orgId, code);
      
      // If verification successful, refresh profile to get updated emailVerified status
      if (result.verified) {
        const profile = await mockApiService.profile.getProfile(orgId);
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
