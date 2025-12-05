// Axios imports kept for future backend reconnection
// @ts-expect-error - Keeping axios import for future backend reconnection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// ============================================
// BACKEND DISCONNECTED - API CLIENT DISABLED
// ============================================
// This file has been temporarily disconnected from the backend
// All API calls are commented out while changes are being made
// ============================================

// @ts-expect-error - Keeping for future backend reconnection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Create axios instance with default config
// COMMENTED OUT - Backend disconnected
/*
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
    console.log('API Request data:', config.data);
    
    const token = localStorage.getItem('accessToken');
    
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
    console.log('API Response data:', response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('=== API ERROR ===');
    console.error('Error:', error.message);
    console.error('Error response:', error.response);
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      console.error('Error status:', status);
      console.error('Error data:', error.response.data);
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          console.error('Unauthorized - clearing auth data');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
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
      console.error('Request:', error.request);
    } else {
      // Error in request configuration
      console.error('Request configuration error:', error.message);
    }
    
    return Promise.reject(error);
  }
);
*/

// Mock API client for disconnected mode
interface MockApiClient {
  get: () => Promise<never>;
  post: () => Promise<never>;
  put: () => Promise<never>;
  delete: () => Promise<never>;
  patch: () => Promise<never>;
}

const apiClient: MockApiClient = {
  get: () => Promise.reject(new Error('Backend disconnected')),
  post: () => Promise.reject(new Error('Backend disconnected')),
  put: () => Promise.reject(new Error('Backend disconnected')),
  delete: () => Promise.reject(new Error('Backend disconnected')),
  patch: () => Promise.reject(new Error('Backend disconnected')),
};

export default apiClient;
