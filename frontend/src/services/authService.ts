import apiClient from './api';
import type { LoginCredentials, SignupData } from '@/types/auth';
import type { User } from '@/types/user';

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
  freelancerProfile?: any;
  clientProfile?: any;
  organizationProfile?: any;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: SignupData): Promise<User> {
    console.log('AuthService.register - Sending request to:', '/api/auth/register');
    console.log('AuthService.register - Request data:', data);
    
    const response = await apiClient.post<RegisterResponse>('/api/auth/register', data);
    
    console.log('AuthService.register - Response received:', response.data);
    
    // Map backend role to frontend role (backend uses British spelling)
    const backendToFrontendRole = (backendRole: string): string => {
      const roleMap: Record<string, string> = {
        'ORGANISATION': 'organization',
        'CLIENT': 'client',
        'FREELANCER': 'freelancer',
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
      freelancerProfile: response.data.freelancerProfile,
      clientProfile: response.data.clientProfile,
      organizationProfile: response.data.organizationProfile,
    };
    
    console.log('AuthService.register - Transformed user:', user);
    return user;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    console.log('AuthService.login - Sending request to:', '/api/auth/login');
    console.log('AuthService.login - Credentials:', { email: credentials.email, password: '***' });
    
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
        'FREELANCER': 'freelancer',
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
   */
  async healthCheck(): Promise<string> {
    const response = await apiClient.get<string>('/api/auth/health');
    return response.data;
  }
}

export default new AuthService();
