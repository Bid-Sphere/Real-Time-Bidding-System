import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

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

export default apiClient;
