// API Configuration - Real API only
import { realApiService } from '@/services/realApiService';

// Export the real API service
export const apiService = realApiService;

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 seconds
};

// Helper function to get API base URL
export const getAPIBaseURL = () => API_CONFIG.BASE_URL;