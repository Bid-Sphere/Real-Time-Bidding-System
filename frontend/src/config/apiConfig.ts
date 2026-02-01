// API Configuration - Project API Service
import { projectApiService } from '@/services/projectApiService';

// Export the project API service
export const apiService = projectApiService;

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  TIMEOUT: 10000, // 10 seconds
};

// Helper function to get API base URL
export const getAPIBaseURL = () => API_CONFIG.BASE_URL;