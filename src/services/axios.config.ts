// src/services/axios.config.ts
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenManager } from '../utils/tokenManager';

// Extend AxiosRequestConfig to include _retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Track if we're already refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Function to refresh token
const refreshToken = async (): Promise<string | null> => {
  try {
    console.log('🔄 Attempting to refresh token...');
    
    const response = await axios.post(`${baseURL}/auth/refresh`, {}, {
      headers: {
        'Authorization': `Bearer ${tokenManager.getToken()}`
      }
    });
    
    const { token } = response.data;
    
    const user = tokenManager.getUser();
    if (user && token) {
      tokenManager.setToken(token, user);
      console.log('✅ Token refreshed successfully');
      return token;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    tokenManager.clearToken();
    return null;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    const token = tokenManager.getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - FIXED VERSION
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Response from ${response.config.url}:`, response.status);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        url: originalRequest.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    // Handle 401 Unauthorized errors (token expired) - BUT NOT FOR LOGIN
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry login requests - let them fail with proper error message
      if (originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = await refreshToken();
        
        if (token) {
          processQueue(null, token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Failed to refresh token');
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        tokenManager.clearToken();
        
        // Only redirect to login if we're not already on the login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login?session=expired';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }

    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Cannot connect to server. Please check if backend is running.'));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;