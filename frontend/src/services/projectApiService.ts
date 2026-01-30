// Project API Service - Backend integration for project management
import type { CreateProjectData, Project } from '@/types/project';
import { useAuthStore } from '@/store/authStore';

// All API calls must go through nginx gateway
const API_BASE_URL = 'http://localhost:8080';

// Get auth headers from store
const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Utility function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Log response in development for debugging
    if (import.meta.env.DEV) {
      console.log(`API Response [${endpoint}]:`, data);
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Map frontend data to backend format
const mapProjectToBackend = (data: CreateProjectData) => {
  return {
    title: data.title,
    description: data.description,
    category: data.category, // Already in correct format (IT, CONSTRUCTION, SUPPLY)
    budget: data.budget,
    deadline: data.deadline.toISOString(), // Convert Date to ISO string
    location: data.location || null,
    requiredSkills: data.requiredSkills || [],
    strictDeadline: data.strictDeadline || false,
    biddingType: data.biddingType, // Already in correct format (LIVE_AUCTION, STANDARD)
    auctionEndTime: data.auctionEndTime ? data.auctionEndTime.toISOString() : null,
    isDraft: data.isDraft || false,
    attachments: [] // Empty for now, file upload not implemented
  };
};

// Map backend response to frontend format
const mapProjectFromBackend = (backendProject: any): Project => {
  // Helper to safely parse dates
  const parseDate = (dateValue: any): Date => {
    if (!dateValue) return new Date();
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  return {
    id: backendProject.id,
    title: backendProject.title || 'Untitled Project',
    description: backendProject.description || '',
    category: backendProject.category,
    budget: backendProject.budget || 0,
    deadline: parseDate(backendProject.deadline),
    status: backendProject.status,
    biddingType: backendProject.biddingType,
    location: backendProject.location,
    requiredSkills: backendProject.requiredSkills || [],
    attachments: backendProject.attachments || [],
    bidCount: backendProject.bidCount || 0,
    viewCount: backendProject.viewCount || 0,
    createdAt: parseDate(backendProject.createdAt),
    updatedAt: parseDate(backendProject.updatedAt),
    clientId: backendProject.clientId,
    clientName: backendProject.clientName || 'Unknown Client',
    strictDeadline: backendProject.strictDeadline || false,
    auctionEndTime: backendProject.auctionEndTime ? parseDate(backendProject.auctionEndTime) : undefined,
    isDraft: backendProject.isDraft || false,
    isBookmarked: backendProject.isBookmarked || false,
    averageBidAmount: backendProject.averageBidAmount || 0
  };
};

// Project API Service
export const projectApiService = {
  // Create a new project
  createProject: async (projectData: CreateProjectData): Promise<Project> => {
    const backendData = mapProjectToBackend(projectData);
    const response = await apiCall('/api/projects', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
    
    return mapProjectFromBackend(response.data);
  },

  // Get all projects for the current client
  getMyProjects: async (status?: string, page: number = 0, limit: number = 20): Promise<{ projects: Project[]; total: number }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status && status !== 'all') {
      params.append('status', status);
    }
    
    const response = await apiCall(`/api/projects/my-projects?${params.toString()}`);
    
    try {
      return {
        projects: response.data.content.map((project: any, index: number) => {
          try {
            return mapProjectFromBackend(project);
          } catch (error) {
            console.error(`Error mapping project at index ${index}:`, project, error);
            throw new Error(`Failed to map project "${project?.title || 'Unknown'}": ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }),
        total: response.data.totalElements || 0
      };
    } catch (error) {
      console.error('Error in getMyProjects:', error);
      throw error;
    }
  },

  // Get a single project by ID
  getProjectById: async (projectId: string): Promise<Project> => {
    const response = await apiCall(`/api/projects/${projectId}`);
    return mapProjectFromBackend(response.data);
  },

  // Update a project
  updateProject: async (projectId: string, projectData: Partial<CreateProjectData>): Promise<Project> => {
    const backendData = projectData.deadline 
      ? { ...projectData, deadline: projectData.deadline.toISOString() }
      : projectData;
      
    const response = await apiCall(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
    
    return mapProjectFromBackend(response.data);
  },

  // Delete a project
  deleteProject: async (projectId: string): Promise<void> => {
    await apiCall(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
  },

  // Update project status
  updateProjectStatus: async (projectId: string, status: string, reason?: string): Promise<Project> => {
    const response = await apiCall(`/api/projects/${projectId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
    
    return mapProjectFromBackend(response.data);
  },

  // Publish a draft project
  publishProject: async (projectId: string): Promise<Project> => {
    const response = await apiCall(`/api/projects/${projectId}/publish`, {
      method: 'POST',
    });
    
    return mapProjectFromBackend(response.data);
  },

  // Get client dashboard statistics
  getClientStats: async (): Promise<any> => {
    const response = await apiCall('/api/projects/client/stats');
    return response.data;
  },

  // Get project analytics
  getProjectAnalytics: async (projectId: string): Promise<any> => {
    const response = await apiCall(`/api/projects/${projectId}/analytics`);
    return response.data;
  },

  // Track project view
  trackView: async (projectId: string): Promise<void> => {
    await apiCall(`/api/projects/${projectId}/view`, {
      method: 'POST',
    });
  },
};

export default projectApiService;