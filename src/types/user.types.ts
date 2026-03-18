export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string; // Changed from 'student' literal to string
  avatarUrl?: string;
  bio?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role?: string; // Optional role with default 'student'
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface EmailCheckResponse {
  available: boolean;
  exists?: boolean;
}