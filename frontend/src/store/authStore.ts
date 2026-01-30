import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, LoginCredentials, SignupData } from '@/types/auth';
import authService from '@/services/authService';
import { setAuthToken, clearAuthToken } from '@/services/api';

interface ExtendedAuthState extends AuthState {
  token: string | null;
  registrationStep: number | null;
  setToken: (token: string | null) => void;
  initializeAuth: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<ExtendedAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      registrationStep: null,

      setToken: (token: string | null) => {
        set({ token });
        setAuthToken(token);
        authService.setAccessToken(token);
        
        // Store token in localStorage
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
      },

      initializeAuth: async () => {
        // Check for stored token on app initialization
        const storedToken = localStorage.getItem('auth_token');
        
        set({ isLoading: true });
        
        if (storedToken) {
          try {
            // Set token in services first
            get().setToken(storedToken);
            
            // Validate token with backend and get user info
            const user = await authService.getCurrentUser();
            
            set({ 
              user,
              isAuthenticated: true,
              isLoading: false 
            });
            console.log('Auth state restored from localStorage');
          } catch (error) {
            console.error('Failed to restore auth state:', error);
            // Clear invalid token and reset state
            get().logout();
            set({ isLoading: false });
          }
        } else {
          // No token found, user is not authenticated
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false 
          });
        }
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        
        try {
          const { user, token } = await authService.login(credentials);
          
          // Update store and API client with token
          get().setToken(token);
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            registrationStep: null // Clear any registration state
          });
          
          // Fetch full user data with profile information
          await get().refreshUser();
          
          return user;
        } catch (error) {
          set({ isLoading: false });
          console.error('Login error:', error);
          throw error;
        }
      },

      signup: async (data: SignupData) => {
        set({ isLoading: true });
        
        try {
          // Phase 1 registration - only basic info
          const response = await authService.registerInitial(data);
          
          // Don't auto-login after Phase 1 registration
          // User needs to login manually after registration
          set({ 
            isLoading: false,
            registrationStep: response.registrationStep
          });
          
          return response;
        } catch (error) {
          set({ isLoading: false });
          console.error('Signup error:', error);
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        get().setToken(null);
        clearAuthToken();
        localStorage.removeItem('auth_token');
        set({ 
          user: null, 
          isAuthenticated: false,
          registrationStep: null
        });
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;
        
        try {
          const user = await authService.getCurrentUser();
          set({ user });
          console.log('User data refreshed:', user);
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      },

      checkAuth: () => {
        const { token } = get();
        const isAuthenticated = authService.isAuthenticated() && token !== null;
        
        if (isAuthenticated) {
          set({ isAuthenticated: true, isLoading: false });
        } else {
          // Clear everything if not authenticated
          get().setToken(null);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            registrationStep: null
          });
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        // Don't persist isAuthenticated - it should be validated on app load
      }), // Only persist these fields
    }
  )
);
