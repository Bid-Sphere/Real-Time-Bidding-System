import apiClient from './api';
import type { LoginCredentials, SignupData } from '@/types/auth';
import type { User } from '@/types/user';

// API Response types for Phase 1
export interface Phase1RegisterRequest {
  email: string;
  password: string;
  role: 'CLIENT' | 'ORGANISATION';
}

export interface Phase1RegisterResponse {
  message: string;
  registrationStatus: 'PENDING';
  registrationStep: 1;
  token: string;
  email: string;
  userId: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
  expiresIn: number;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Initialize token from localStorage on service creation
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Phase 1 Registration - Initial registration with basic info
   */
  async registerInitial(data: SignupData): Promise<Phase1RegisterResponse> {
    try {
      // Map frontend role to backend role
      const roleMap: Record<string, 'CLIENT' | 'ORGANISATION'> = {
        'client': 'CLIENT',
        'organization': 'ORGANISATION',
      };

      const requestData: Phase1RegisterRequest = {
        email: data.email,
        password: data.password,
        role: roleMap[data.role] || 'CLIENT',
      };

      const response = await apiClient.post<Phase1RegisterResponse>(
        '/api/auth/register-initial',
        requestData
      );

      return response.data;
    } catch (error: any) {
      console.error('Phase 1 registration error:', error);
      
      // Handle specific error responses
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Registration failed. Please try again.');
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/api/auth/login',
        credentials
      );

      const { accessToken, userId, email, fullName, role } = response.data;
      
      // Store token
      this.token = accessToken;

      // Map backend role to frontend role
      const roleMap: Record<string, 'client' | 'organization'> = {
        'CLIENT': 'client',
        'ORGANISATION': 'organization',
      };

      // Create user object
      const user: User = {
        id: userId.toString(),
        fullName,
        email,
        role: roleMap[role as keyof typeof roleMap] || 'client',
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      return { user, token: accessToken };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error responses
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    console.log('User logged out');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.token;
  }

  /**
   * Set access token (used by auth store)
   */
  setAccessToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Send email verification code
   */
  async sendVerificationCode(): Promise<{ message: string; expiresAt: string }> {
    try {
      const response = await apiClient.post<{ message: string; expiresAt: string }>(
        '/api/auth/send-verification-code'
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Send verification code error:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Failed to send verification code. Please try again.');
    }
  }

  /**
   * Verify email code
   */
  async verifyEmailCode(code: string): Promise<{ verified: boolean; message: string; phase2Eligible?: boolean }> {
    try {
      const response = await apiClient.post<{ verified: boolean; message: string; phase2Eligible?: boolean }>(
        '/api/auth/verify-email-code',
        null,
        { params: { code } }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Verify email code error:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Failed to verify code. Please try again.');
    }
  }

  /**
   * Get current user info from token
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{
        id: number;
        email: string;
        fullName: string;
        role: string;
        isActive: boolean;
        emailVerified: boolean;
        registrationStatus: string;
        registrationStep: number;
        organizationProfile?: any;
        clientProfile?: any;
      }>('/api/auth/me');

      const { id, email, fullName, role, isActive, emailVerified, organizationProfile, clientProfile } = response.data;
      
      // Map backend role to frontend role
      const roleMap: Record<string, 'client' | 'organization'> = {
        'CLIENT': 'client',
        'ORGANISATION': 'organization',
      };

      const user: User = {
        id: id.toString(),
        fullName,
        email,
        role: roleMap[role as keyof typeof roleMap] || 'client',
        createdAt: new Date().toISOString(),
        isActive,
        emailVerified: emailVerified || false,
        organizationProfile,
        clientProfile,
      };

      return user;
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw new Error('Failed to get user information');
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<string> {
    try {
      const response = await apiClient.get<{ status: string; message: string }>(
        '/api/auth/health'
      );
      
      return response.data.message || 'Auth service is healthy';
    } catch (error: any) {
      console.error('Health check error:', error);
      throw new Error('Auth service is unavailable');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Record<string, any>): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<{ message: string }>(
        '/api/users/profile',
        profileData
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      throw new Error('Failed to update profile. Please try again.');
    }
  }
}

export default new AuthService();
