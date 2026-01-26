// Real API Service - Ready for backend integration
import type { ClientProfile, ClientProject, ReceivedBid, ClientAnalyticsData } from '@/types/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Utility function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Real API Service (same interface as mock)
export const realApiService = {
  client: {
    // Profile APIs
    getProfile: async (clientId: string): Promise<ClientProfile> => {
      return apiCall(`/clients/${clientId}/profile`);
    },

    updateProfile: async (clientId: string, data: Partial<ClientProfile>): Promise<ClientProfile> => {
      return apiCall(`/clients/${clientId}/profile`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // Analytics APIs
    getAnalytics: async (clientId: string): Promise<ClientAnalyticsData> => {
      return apiCall(`/clients/${clientId}/analytics`);
    },

    // Verification APIs
    sendVerificationCode: async (clientId: string): Promise<{ message: string; expiresAt: string }> => {
      return apiCall(`/clients/${clientId}/verify/send-code`, {
        method: 'POST',
      });
    },

    verifyCode: async (clientId: string, code: string): Promise<{ verified: boolean; message: string }> => {
      return apiCall(`/clients/${clientId}/verify/confirm`, {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
    },

    // Project APIs
    getProjects: async (clientId: string, filters?: any): Promise<ClientProject[]> => {
      const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
      return apiCall(`/clients/${clientId}/projects${queryParams}`);
    },

    createProject: async (clientId: string, projectData: Omit<ClientProject, 'id' | 'clientId' | 'postedAt' | 'updatedAt' | 'bidCount'>): Promise<ClientProject> => {
      return apiCall(`/clients/${clientId}/projects`, {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
    },

    updateProject: async (projectId: string, updates: Partial<ClientProject>): Promise<ClientProject> => {
      return apiCall(`/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    deleteProject: async (projectId: string): Promise<{ success: boolean }> => {
      return apiCall(`/projects/${projectId}`, {
        method: 'DELETE',
      });
    },

    getProjectBids: async (projectId: string): Promise<ReceivedBid[]> => {
      return apiCall(`/projects/${projectId}/bids`);
    },

    // File Upload APIs
    uploadProjectDocument: async (clientId: string, file: File): Promise<{ url: string; id: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/clients/${clientId}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return response.json();
    },
  }
};

export default realApiService;