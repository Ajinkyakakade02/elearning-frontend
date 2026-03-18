// src/utils/tokenManager.ts
import { User } from '../types/user.types';

// Simple encryption for localStorage (base64 encoding for obfuscation)
const encryptToken = (token: string): string => {
  try {
    return btoa(token); // Base64 encode
  } catch (e) {
    console.error('Error encrypting token:', e);
    return token;
  }
};

const decryptToken = (encrypted: string): string => {
  try {
    return atob(encrypted); // Base64 decode
  } catch (e) {
    console.error('Error decrypting token:', e);
    return '';
  }
};

// Token expiration time (24 hours in milliseconds)
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const tokenManager = {
  /**
   * Set token and user data in localStorage with expiration
   */
  setToken(token: string, user: User) {
    console.log('💾 Setting token in localStorage');
    
    try {
      // Encrypt token before storing
      localStorage.setItem('auth_token', encryptToken(token));
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      // Set expiration (24 hours from now)
      const expires = new Date().getTime() + TOKEN_EXPIRY_MS;
      localStorage.setItem('auth_expires', expires.toString());
      
      console.log('✅ Token stored successfully, expires:', new Date(expires).toLocaleString());
    } catch (error) {
      console.error('❌ Error storing token:', error);
    }
  },
  
  /**
   * Get decrypted token from localStorage
   */
  getToken(): string | null {
    try {
      const encrypted = localStorage.getItem('auth_token');
      const expires = localStorage.getItem('auth_expires');
      
      if (!encrypted) {
        return null;
      }
      
      // Check if token is expired
      if (expires) {
        const expiryTime = parseInt(expires);
        const currentTime = new Date().getTime();
        
        if (expiryTime < currentTime) {
          console.log('⏰ Token expired at:', new Date(expiryTime).toLocaleString());
          this.clearToken();
          return null;
        }
        
        // Log remaining time for debugging
        const remainingMs = expiryTime - currentTime;
        const remainingHours = Math.floor(remainingMs / (60 * 60 * 1000));
        const remainingMins = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
        
        if (remainingHours < 1) {
          console.log(`⏳ Token expires in ${remainingMins} minutes`);
        }
      }
      
      return decryptToken(encrypted);
    } catch (error) {
      console.error('❌ Error getting token:', error);
      return null;
    }
  },
  
  /**
   * Get user from localStorage
   */
  getUser(): User | null {
    try {
      const userStr = localStorage.getItem('auth_user');
      console.log('📄 Raw user string from localStorage:', userStr);
      
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        console.log('ℹ️ No valid user found in localStorage');
        return null;
      }
      
      const user = JSON.parse(userStr) as User;
      
      // Validate user object has required fields
      if (!user.id || !user.email) {
        console.log('⚠️ Invalid user object in localStorage');
        this.clearToken();
        return null;
      }
      
      console.log('✅ Parsed user:', { ...user, password: undefined });
      return user;
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      // Clear invalid data
      this.clearToken();
      return null;
    }
  },
  
  /**
   * Check if user is authenticated (has valid token and user)
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    const expires = localStorage.getItem('auth_expires');
    
    if (!token || !user) {
      console.log('ℹ️ Not authenticated: missing token or user');
      return false;
    }
    
    // Check expiration
    if (expires) {
      const expiryTime = parseInt(expires);
      if (expiryTime < new Date().getTime()) {
        console.log('ℹ️ Not authenticated: token expired');
        this.clearToken();
        return false;
      }
    }
    
    console.log('✅ User is authenticated');
    return true;
  },
  
  /**
   * Update user data in localStorage
   */
  updateUser(user: User): void {
    try {
      localStorage.setItem('auth_user', JSON.stringify(user));
      console.log('✅ User updated successfully');
    } catch (error) {
      console.error('❌ Error updating user:', error);
    }
  },
  
  /**
   * Clear all auth data from localStorage
   */
  clearToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expires');
    console.log('🗑️ Auth data cleared from localStorage');
  },
  
  /**
   * Get token expiration time as Date object
   */
  getExpirationDate(): Date | null {
    const expires = localStorage.getItem('auth_expires');
    if (!expires) return null;
    return new Date(parseInt(expires));
  },
  
  /**
   * Check if token is about to expire (within next 30 minutes)
   */
  isTokenExpiringSoon(): boolean {
    const expires = localStorage.getItem('auth_expires');
    if (!expires) return false;
    
    const expiryTime = parseInt(expires);
    const currentTime = new Date().getTime();
    const thirtyMinutes = 30 * 60 * 1000;
    
    return (expiryTime - currentTime) < thirtyMinutes;
  }
};