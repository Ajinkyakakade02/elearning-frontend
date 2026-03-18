import { User, LoginCredentials, RegisterData, AuthResponse, EmailCheckResponse } from '../types/user.types';
import axiosInstance from './axios.config';
import { API_ENDPOINTS } from './api.config';
import { tokenManager } from '../utils/tokenManager';

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('📡 Login API call with:', credentials.email);
      const response = await axiosInstance.post<any>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      console.log('✅ Raw login response:', response.data);
      
      // Handle different response structures
      let token: string;
      let userData: any;
      
      if (response.data.token) {
        token = response.data.token;
        userData = response.data.user || response.data;
      } else if (response.data.accessToken) {
        token = response.data.accessToken;
        userData = response.data;
      } else {
        throw new Error('Invalid response structure: No token found');
      }
      
      // Extract user information
      const id = userData.id || userData.userId;
      const email = userData.email || credentials.email;
      const fullName = userData.fullName || userData.name || 'User';
      const role = 'student'; // Force to student
      
      const user: User = {
        id,
        email,
        fullName,
        role,
        isActive: true,
        avatarUrl: userData.avatarUrl,
        bio: userData.bio
      };
      
      console.log('✅ Processed user object:', user);
      
      // Clear any existing data first
      tokenManager.clearToken();
      
      // Set new data with 24 hour expiration
      tokenManager.setToken(token, user);
      
      // Verify it was stored correctly
      const storedUser = tokenManager.getUser();
      console.log('✅ Verified stored user:', storedUser);
      
      return { token, user };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 404) {
        throw new Error('User not found');
      } else if (error.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again later.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timeout. Please check your internet.');
      }
      
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📡 Register API call with:', data.email);
      
      // Prepare registration data - always set role to 'student'
      const registerData = {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: 'student' // Force to student
      };
      
      const response = await axiosInstance.post<any>(
        API_ENDPOINTS.AUTH.REGISTER,
        registerData
      );
      
      console.log('✅ Raw register response:', response.data);
      
      // Check if backend returns token directly
      if (response.data.token) {
        const { token, ...userData } = response.data;
        
        const id = userData.id || userData.userId;
        const email = userData.email || data.email;
        const fullName = userData.fullName || userData.name || data.fullName;
        const role = 'student'; // Force to student
        
        const user: User = {
          id,
          email,
          fullName,
          role,
          isActive: true,
          avatarUrl: userData.avatarUrl,
          bio: userData.bio
        };
        
        tokenManager.setToken(token, user);
        
        return { token, user };
      } else {
        // If no token, try to login
        console.log('ℹ️ No token in register response, attempting login...');
        return this.login({ email: data.email, password: data.password });
      }
    } catch (error: any) {
      console.error('❌ Register error:', error);
      
      if (error.response?.status === 409) {
        throw new Error('Email already registered');
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Invalid registration data');
      }
      
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    tokenManager.clearToken();
    console.log('👋 User logged out');
    
    try {
      axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT).catch(() => {});
    } catch {
      // Ignore errors
    }
  },

  /**
   * Check if email is available for registration
   */
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await axiosInstance.get<EmailCheckResponse>(
        `${API_ENDPOINTS.AUTH.CHECK_EMAIL}?email=${encodeURIComponent(email)}`
      );
      
      return response.data.available === true;
    } catch (error) {
      console.error('❌ Email check failed:', error);
      return false;
    }
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string | null> {
    try {
      console.log('🔄 Refreshing token...');
      
      const response = await axiosInstance.post<{ token: string }>(
        API_ENDPOINTS.AUTH.REFRESH
      );
      
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
  },

  /**
   * Get current user from token
   */
  getCurrentUser(): User | null {
    return tokenManager.getUser();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },

  /**
   * Get auth token
   */
  getToken(): string | null {
    return tokenManager.getToken();
  },

  // ===== OTP & PASSWORD RESET METHODS =====

  async forgotPassword(email: string): Promise<void> {
    try {
      console.log('📡 Requesting password reset OTP for:', email);
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      
      if (response.data && response.data.success) {
        return;
      } else {
        throw new Error(response.data?.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('❌ Forgot password error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Email not registered');
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
      
      throw new Error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  },

  async verifyOTP(email: string, otp: string): Promise<void> {
    try {
      console.log('📡 Verifying OTP for:', email);
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
      
      if (response.data && response.data.success) {
        return;
      } else {
        throw new Error(response.data?.message || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Invalid or expired OTP');
      } else if (error.response?.status === 404) {
        throw new Error('Email not found');
      }
      
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  },

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    try {
      console.log('📡 Resetting password for:', email);
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { 
        email, 
        otp, 
        newPassword 
      });
      
      if (response.data && response.data.success) {
        return;
      } else {
        throw new Error(response.data?.message || 'Failed to reset password');
      }
    } catch (error: any) {
      console.error('❌ Reset password error:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Invalid OTP or expired');
      } else if (error.response?.status === 404) {
        throw new Error('Email not found');
      }
      
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  },

  async resendOTP(email: string): Promise<void> {
    return this.forgotPassword(email);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      console.log('📡 Changing password');
      
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      });
      
      if (response.data && response.data.success) {
        return;
      } else {
        throw new Error(response.data?.message || 'Failed to change password');
      }
    } catch (error: any) {
      console.error('❌ Change password error:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Current password is incorrect');
      }
      
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }
};

export default authService;