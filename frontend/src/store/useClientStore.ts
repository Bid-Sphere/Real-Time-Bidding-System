import { create } from 'zustand';
import type { ClientProfile, ClientAnalyticsData } from '../types/client';
import authService from '@/services/authService';
import { useAuthStore } from './authStore';

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

export const useClientStore = create<ClientState>((set, get) => ({
  profile: null,
  analytics: null,
  isLoading: false,
  error: null,

  fetchProfile: async (clientId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Get user data from auth store which now includes profile data
      const user = useAuthStore.getState().user;
      
      if (user?.clientProfile) {
        // Convert backend profile to frontend format
        const profile: ClientProfile = {
          id: user.clientProfile.id || undefined,
          userId: user.clientProfile.userId || parseInt(user.id),
          companyName: user.clientProfile.companyName || '',
          industry: user.clientProfile.industry || '',
          website: user.clientProfile.website || '',
          billingAddress: user.clientProfile.billingAddress || '',
          taxId: user.clientProfile.taxId || '',
          // Additional fields from User model - handle null/empty fullName properly
          firstName: user.fullName ? user.fullName.split(' ')[0] || '' : '',
          lastName: user.fullName ? user.fullName.split(' ').slice(1).join(' ') || '' : '',
          email: user.email || '',
          emailVerified: user.emailVerified || false,
          completionPercentage: 0, // Will be calculated by the UI
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set({ profile, isLoading: false });
        return;
      }
      
      // If no profile data from backend, try localStorage
      const storedProfile = localStorage.getItem(`client-profile-${clientId}`);
      
      if (storedProfile) {
        const profile: ClientProfile = JSON.parse(storedProfile);
        // Update with latest user data from auth store
        if (user) {
          profile.firstName = user.fullName ? user.fullName.split(' ')[0] || '' : profile.firstName || '';
          profile.lastName = user.fullName ? user.fullName.split(' ').slice(1).join(' ') || '' : profile.lastName || '';
          profile.email = user.email || profile.email;
          profile.emailVerified = user.emailVerified || false;
        }
        set({ profile, isLoading: false });
        return;
      }
      
      // If no stored profile, create a default one
      const profile: ClientProfile = {
        id: undefined,
        userId: user ? parseInt(user.id) : undefined,
        companyName: '',
        industry: '',
        website: '',
        billingAddress: '',
        taxId: '',
        // Additional fields from User model - handle null/empty fullName properly
        firstName: user?.fullName ? user.fullName.split(' ')[0] || '' : '',
        lastName: user?.fullName ? user.fullName.split(' ').slice(1).join(' ') || '' : '',
        email: user?.email || '',
        emailVerified: user?.emailVerified || false,
        completionPercentage: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
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
      // Prepare data for backend - only send fields that match the Client model
      const backendData: Record<string, any> = {};
      
      // Map frontend fields to backend Client model fields
      if (data.companyName !== undefined) backendData.companyName = data.companyName;
      if (data.industry !== undefined) backendData.industry = data.industry;
      if (data.website !== undefined) backendData.website = data.website;
      if (data.billingAddress !== undefined) backendData.billingAddress = data.billingAddress;
      if (data.taxId !== undefined) backendData.taxId = data.taxId;
      
      // Handle firstName/lastName updates (these go to User model, not Client model)
      if (data.firstName !== undefined || data.lastName !== undefined) {
        const currentProfile = get().profile;
        const firstName = data.firstName ?? currentProfile?.firstName ?? '';
        const lastName = data.lastName ?? currentProfile?.lastName ?? '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        // Only send fullName if it's not empty
        if (fullName) {
          backendData.fullName = fullName;
        }
      }
      
      // Update via API
      await authService.updateProfile(backendData);
      
      // Refresh user data to get updated profile from backend FIRST
      await useAuthStore.getState().refreshUser();
      
      // Update local state with the data that was sent
      const currentProfile = get().profile;
      if (!currentProfile) {
        throw new Error('No profile to update');
      }
      
      const updatedProfile: ClientProfile = {
        ...currentProfile,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      // Store in localStorage as backup
      localStorage.setItem(`client-profile-${clientId}`, JSON.stringify(updatedProfile));
      
      set({ profile: updatedProfile, isLoading: false });
      
      // Fetch the profile again to ensure we have the latest data from backend
      setTimeout(() => {
        get().fetchProfile(clientId);
      }, 100);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchAnalytics: async (_clientId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock data for now - replace with actual API call
      const analytics: ClientAnalyticsData = {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalSpent: 0,
        averageBidAmount: 0,
        averageProjectDuration: 0,
        successfulProjects: 0,
        cancelledProjects: 0,
        averageRating: 0
      };
      set({ analytics, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch analytics', 
        isLoading: false 
      });
    }
  },

  sendVerificationCode: async (_clientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.sendVerificationCode();
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

  verifyCode: async (_clientId: string, code: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.verifyEmailCode(code);
      
      // If verification successful, refresh profile to get updated emailVerified status
      if (result.verified) {
        const profile: ClientProfile = {
          ...get().profile!,
          emailVerified: true,
          updatedAt: new Date().toISOString()
        };
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