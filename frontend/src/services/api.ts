import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Token storage - will be managed by AuthService
let authToken: string | null = null;

// Helper functions for token management
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = (): string | null => {
  return authToken;
};

export const clearAuthToken = () => {
  authToken = null;
};

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    
    // Add auth token if available
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request - Auth token added');
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('API Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    console.error('=== API ERROR ===');
    console.error('Error:', error.message);
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      console.error('Error status:', status);
      console.error('Error data:', error.response.data);
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.error('Unauthorized - clearing auth token');
          clearAuthToken();
          
          // Only redirect if not already on login/signup pages
          const currentPath = window.location.pathname;
          if (!['/login', '/signup', '/'].includes(currentPath)) {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error(`Error ${status}: ${error.message}`);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response from server');
    } else {
      // Error in request configuration
      console.error('Request configuration error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
