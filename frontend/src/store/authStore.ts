import { create } from 'zustand';
import type { AuthState, LoginCredentials, SignupData } from '@/types/auth';
import type { User } from '@/types/user';
import {
  saveUser,
  getUser,
  removeUser,
  saveMockUser,
  findMockUser,
} from '@/utils/localStorage';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    
    try {
      // Mock authentication - find user in localStorage
      const user = findMockUser(credentials.email, credentials.password);
      
      if (user) {
        saveUser(user);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        // For mock purposes, accept any credentials and create a temporary user
        // This allows testing without signup
        const mockUser: User = {
          id: crypto.randomUUID(),
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: 'client', // Default role for mock login
          createdAt: new Date().toISOString(),
        };
        saveUser(mockUser);
        set({ user: mockUser, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (data: SignupData) => {
    set({ isLoading: true });
    
    try {
      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: new Date().toISOString(),
      };
      
      // Save to mock users database
      saveMockUser(newUser, data.password);
      
      // Set as current user
      saveUser(newUser);
      set({ user: newUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Signup error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    removeUser();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const user = getUser();
    if (user) {
      set({ user, isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
