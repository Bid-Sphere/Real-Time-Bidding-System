import { create } from 'zustand';
import type { AuthState, LoginCredentials, SignupData } from '@/types/auth';
import authService from '@/services/authService';
import { saveUser, getUser, removeUser } from '@/utils/localStorage';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    
    try {
      const { user } = await authService.login(credentials);
      
      // Save user to localStorage
      saveUser(user);
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Login error:', error);
      throw error;
    }
  },

  signup: async (data: SignupData) => {
    set({ isLoading: true });
    
    try {
      // Map frontend role to backend role (backend uses British spelling)
      const roleMap: Record<string, string> = {
        'client': 'CLIENT',
        'organization': 'ORGANISATION',
      };

      // Transform frontend data to backend format
      const backendData = {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: roleMap[data.role] || data.role.toUpperCase(),
        phone: data.phone,
        location: data.location,
      } as SignupData;

      // Add role-specific profiles
      if (data.role === 'client' && data.clientProfile) {
        backendData.clientProfile = data.clientProfile;
      } else if (data.role === 'organization' && data.organizationProfile) {
        backendData.organizationProfile = data.organizationProfile;
      }

      await authService.register(backendData);
      
      // Don't auto-login after registration
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Signup error:', error);
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    removeUser();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const user = getUser();
    const isAuthenticated = authService.isAuthenticated();
    
    if (user && isAuthenticated) {
      set({ user, isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
