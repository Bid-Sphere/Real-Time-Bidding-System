// Keeping for future backend reconnection
// import apiClient from './api';
import type { LoginCredentials, SignupData } from '@/types/auth';
import type { User } from '@/types/user';

// ============================================
// BACKEND DISCONNECTED - AUTH SERVICE DISABLED
// ============================================
// This file has been temporarily disconnected from the backend
// All API calls are commented out while changes are being made
// Using mock data for testing frontend functionality
// ============================================

// API Response types
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
  expiresIn: number;
}

export interface RegisterResponse {
  id: number;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  phone?: string;
  location?: string;
  clientProfile?: Record<string, unknown>;
  organizationProfile?: Record<string, unknown>;
}

class AuthService {
  /**
   * Register a new user
   * BACKEND DISCONNECTED - Using mock implementation
   */
  async register(data: SignupData): Promise<User> {
    console.log('AuthService.register - BACKEND DISCONNECTED - Using mock data');
    console.log('AuthService.register - Request data:', data);
    
    // COMMENTED OUT - Backend disconnected
    /*
    const response = await apiClient.post<RegisterResponse>('/api/auth/register', data);
    
    console.log('AuthService.register - Response received:', response.data);
    
    // Map backend role to frontend role (backend uses British spelling)
    const backendToFrontendRole = (backendRole: string): string => {
      const roleMap: Record<string, string> = {
        'ORGANISATION': 'organization',
        'CLIENT': 'client',
      };
      return roleMap[backendRole] || backendRole.toLowerCase();
    };
    
    // Transform backend response to frontend User type
    const user: User = {
      id: response.data.id.toString(),
      fullName: response.data.fullName,
      email: response.data.email,
      role: backendToFrontendRole(response.data.role) as any,
      phone: response.data.phone,
      location: response.data.location,
      createdAt: response.data.createdAt,
      clientProfile: response.data.clientProfile,
      organizationProfile: response.data.organizationProfile,
    };
    
    console.log('AuthService.register - Transformed user:', user);
    return user;
    */
    
    // Mock response for disconnected mode
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      phone: data.phone,
      location: data.location,
      createdAt: new Date().toISOString(),
      clientProfile: data.clientProfile,
      organizationProfile: data.organizationProfile,
    };
    
    console.log('AuthService.register - Mock user created:', user);
    return user;
  }

  /**
   * Login user
   * BACKEND DISCONNECTED - Using mock implementation
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    console.log('AuthService.login - BACKEND DISCONNECTED - Using mock data');
    console.log('AuthService.login - Credentials:', { email: credentials.email, password: '***' });
    
    // COMMENTED OUT - Backend disconnected
    /*
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    
    console.log('AuthService.login - Response received:', response.data);
    
    const { accessToken, userId, email, fullName, role } = response.data;
    
    // Store token
    localStorage.setItem('accessToken', accessToken);
    console.log('AuthService.login - Token stored in localStorage');
    
    // Map backend role to frontend role (backend uses British spelling)
    const backendToFrontendRole = (backendRole: string): string => {
      const roleMap: Record<string, string> = {
        'ORGANISATION': 'organization',
        'CLIENT': 'client',
      };
      return roleMap[backendRole] || backendRole.toLowerCase();
    };
    
    // Create user object
    const user: User = {
      id: userId.toString(),
      fullName,
      email,
      role: backendToFrontendRole(role) as any,
      createdAt: new Date().toISOString(),
    };
    
    console.log('AuthService.login - User object created:', user);
    return { user, token: accessToken };
    */
    
    // Mock response for disconnected mode
    const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('accessToken', mockToken);
    
    // Determine role based on email for testing
    let role: 'client' | 'organization' = 'client';
    if (credentials.email.includes('org')) {
      role = 'organization';
    }
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: 'Mock User',
      email: credentials.email,
      role: role,
      createdAt: new Date().toISOString(),
    };
    
    console.log('AuthService.login - Mock user created:', user);
    return { user, token: mockToken };
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Health check
   * BACKEND DISCONNECTED - Using mock implementation
   */
  async healthCheck(): Promise<string> {
    console.log('AuthService.healthCheck - BACKEND DISCONNECTED');
    
    // COMMENTED OUT - Backend disconnected
    /*
    const response = await apiClient.get<string>('/api/auth/health');
    return response.data;
    */
    
    return 'Backend disconnected - mock health check OK';
  }
}

export default new AuthService();
