// API Configuration - Switch between mock and real API
import { mockApiService } from '@/mocks/mockApiService';
import { realApiService } from '@/services/realApiService';

// Environment configuration
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true' || process.env.NODE_ENV === 'development';

// Export the appropriate API service based on environment
export const apiService = USE_MOCK_API ? mockApiService : realApiService;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 seconds
  USE_MOCK: USE_MOCK_API,
};

// Helper function to check if using mock API
export const isMockAPI = () => USE_MOCK_API;

// Helper function to get API base URL
export const getAPIBaseURL = () => API_CONFIG.BASE_URL;