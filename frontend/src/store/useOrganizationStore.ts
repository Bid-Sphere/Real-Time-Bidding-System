import { create } from 'zustand';
import type { OrganizationProfile, AnalyticsData } from '@/types/organization';
import authService from '@/services/authService';
import { useAuthStore } from './authStore';


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

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  profile: null,
  analytics: null,
  isLoading: false,
  error: null,

  fetchProfile: async (orgId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Get user data from auth store which now includes profile data
      const user = useAuthStore.getState().user;
      
      if (user?.organizationProfile) {
        // Convert backend profile to frontend format
        const profile: OrganizationProfile = {
          id: user.organizationProfile.id?.toString() || orgId,
          userId: user.organizationProfile.userId?.toString() || user.id,
          companyName: user.organizationProfile.companyName || '',
          industry: user.organizationProfile.industry || '',
          website: user.organizationProfile.website || '',
          taxId: user.organizationProfile.taxId || '',
          businessRegistrationNumber: user.organizationProfile.businessRegistrationNumber || '',
          contactPerson: user.organizationProfile.contactPerson || user.fullName || '',
          contactPersonRole: user.organizationProfile.contactPersonRole || '',
          logo: '',
          location: user.location || '',
          emailVerified: user.emailVerified || false,
          completionPercentage: 0, // Will be calculated by the UI
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set({ profile, isLoading: false });
        return;
      }
      
      // If no profile data from backend, try localStorage
      const storedProfile = localStorage.getItem(`org-profile-${orgId}`);
      
      if (storedProfile) {
        const profile: OrganizationProfile = JSON.parse(storedProfile);
        // Update with latest user data from auth store
        if (user) {
          profile.contactPerson = user.fullName || profile.contactPerson || '';
          profile.emailVerified = user.emailVerified || false;
          profile.location = user.location || profile.location || '';
        }
        set({ profile, isLoading: false });
        return;
      }
      
      // If no stored profile, create a default one
      const profile: OrganizationProfile = {
        id: orgId,
        userId: user?.id || 'user-1',
        companyName: '',
        industry: '',
        website: '',
        taxId: '',
        businessRegistrationNumber: '',
        contactPerson: user?.fullName || '',
        contactPersonRole: '',
        logo: '',
        location: user?.location || '',
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

  updateProfile: async (orgId: string, data: Partial<OrganizationProfile>) => {
    set({ isLoading: true, error: null });
    try {
      // Prepare data for backend - map contactPerson to fullName for User table
      const backendData: Record<string, any> = { ...data };
      
      // If contactPerson is being updated, also update fullName in User table
      if (data.contactPerson !== undefined) {
        backendData.contactPerson = data.contactPerson;
        // Don't send fullName separately as it will be handled by backend
      }
      
      // Update via API
      await authService.updateProfile(backendData);
      
      // Refresh user data to get updated profile from backend FIRST
      await useAuthStore.getState().refreshUser();
      
      // Update local state
      const currentProfile = get().profile;
      if (!currentProfile) {
        throw new Error('No profile to update');
      }
      
      const updatedProfile: OrganizationProfile = {
        ...currentProfile,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      // Store in localStorage as backup
      localStorage.setItem(`org-profile-${orgId}`, JSON.stringify(updatedProfile));
      
      set({ profile: updatedProfile, isLoading: false });
      
      // Fetch the profile again to ensure we have the latest data from backend
      setTimeout(() => {
        get().fetchProfile(orgId);
      }, 100);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchAnalytics: async (_orgId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock data for now - replace with actual API call
      const analytics: AnalyticsData = {
        totalBids: 0,
        winRate: 0,
        activeProjects: 0,
        totalEarnings: 0,
        pendingBids: 0,
        acceptedBids: 0,
        rejectedBids: 0,
        averageResponseTime: 0,
        completionRate: 0
      };
      set({ analytics, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch analytics', 
        isLoading: false 
      });
    }
  },

  sendVerificationCode: async (_orgId: string) => {
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

  verifyCode: async (_orgId: string, code: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.verifyEmailCode(code);
      
      // If verification successful, refresh profile to get updated emailVerified status
      if (result.verified) {
        const profile: OrganizationProfile = {
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
