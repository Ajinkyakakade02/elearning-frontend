import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/user.types';
import { authService } from '../services/auth.service';
import { tokenManager } from '../utils/tokenManager';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<User>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = tokenManager.getToken();
        const savedUser = tokenManager.getUser();
        
        console.log('Loading user - Token:', token ? 'exists' : 'none');
        console.log('Loading user - Saved user:', savedUser);
        
        if (token && savedUser) {
          // Ensure role is always 'student' for this app
          const normalizedUser = {
            ...savedUser,
            role: 'student' // Force to student
          };
          setUser(normalizedUser);
          console.log('User set from storage:', normalizedUser);
        } else {
          console.log('No valid user found in storage');
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await authService.login(credentials);
      console.log('Login response:', response);
      
      // Force role to be 'student'
      const normalizedUser = {
        ...response.user,
        role: 'student'
      };
      
      setUser(normalizedUser);
      console.log('User set after login:', normalizedUser);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Attempting registration with:', data.email);
      const response = await authService.register(data);
      console.log('Registration response:', response);
      
      // Force role to be 'student'
      const normalizedUser = {
        ...response.user,
        role: 'student'
      };
      
      setUser(normalizedUser);
      console.log('User set after registration:', normalizedUser);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    console.log('User logged out');
  };

  const updateUser = async (userData: Partial<User>): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenManager.getToken()}`
        },
        body: JSON.stringify(userData)
      });
      
      const updatedUser = await response.json();
      
      // Force role to be 'student'
      const normalizedUser = {
        ...updatedUser,
        role: 'student'
      };
      
      setUser(normalizedUser);
      tokenManager.updateUser(normalizedUser);
      
      return normalizedUser;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Log authentication state changes
  useEffect(() => {
    console.log('Auth state changed - isAuthenticated:', !!user, 'user:', user);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};