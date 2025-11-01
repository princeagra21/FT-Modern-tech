import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiError } from '@/lib/types/api';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:3001', // Your actual backend URL
  timeout: 10000,
  withCredentials: true, // Enable cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other common headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    let apiError: ApiError = {
      message: error.message || 'An error occurred',
      status: error.response?.status,
      code: error.code,
    };
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status - extract the actual error message from response
      const responseData = error.response.data as any;
      
      if (responseData && responseData.message) {
        // Use the server's error message
        apiError.message = responseData.message;
      } else if (responseData && responseData.error) {
        // Use the error field if message is not available
        apiError.message = responseData.error;
      } else {
        // Fallback to generic message
        apiError.message = `Server Error: ${error.response.status} ${error.response.statusText}`;
      }
      
      // Include additional error details if available
      apiError.status = error.response.status;
      if (responseData && responseData.statusCode) {
        apiError.status = responseData.statusCode;
      }
    } else if (error.request) {
      // Request made but no response received
      apiError.message = 'Network Error: No response from server';
    }
    
    return Promise.reject(apiError);
  }
);

// Generic API methods
export const apiClient = {
  // GET request
  get: async <T>(url: string): Promise<T> => {
    try {
      const response = await api.get<T>(url);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // POST request
  post: async <T, D = unknown>(url: string, data: D): Promise<T> => {
    try {
      const response = await api.post<T>(url, data);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // PUT request
  put: async <T, D = unknown>(url: string, data: D): Promise<T> => {
    try {
      const response = await api.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // PATCH request
  patch: async <T, D = unknown>(url: string, data: D): Promise<T> => {
    try {
      const response = await api.patch<T>(url, data);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // DELETE request
  delete: async <T>(url: string): Promise<T> => {
    try {
      const response = await api.delete<T>(url);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};

export default api;
