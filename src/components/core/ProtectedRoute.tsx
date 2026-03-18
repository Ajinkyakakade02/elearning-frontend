import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { tokenManager } from '../../utils/tokenManager';
import authService from '../../services/auth.service';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login',
  fallback
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationPassed, setVerificationPassed] = useState(false);

  // Verify token and authentication status
  useEffect(() => {
    const verifyAuth = async () => {
      setIsVerifying(true);
      
      try {
        // Check if token exists and is valid
        const token = tokenManager.getToken();
        const expires = localStorage.getItem('auth_expires');
        
        console.log('🛡️ ProtectedRoute - Verifying authentication...');
        console.log('📍 Current path:', location.pathname);
        console.log('🔑 Token exists:', !!token);
        console.log('👤 User exists:', !!user);
        console.log('⏰ Token expires:', expires ? new Date(parseInt(expires)).toLocaleString() : 'No expiry');
        
        // Check token expiration
        if (token && expires) {
          const expiryTime = parseInt(expires);
          const currentTime = new Date().getTime();
          
          if (expiryTime < currentTime) {
            console.log('⏰ Token expired, clearing...');
            tokenManager.clearToken();
            setVerificationPassed(false);
            setIsVerifying(false);
            return;
          }
          
          // Check if token is expiring soon (within 5 minutes)
          const fiveMinutes = 5 * 60 * 1000;
          if ((expiryTime - currentTime) < fiveMinutes) {
            console.log('⚠️ Token expiring soon, attempting refresh...');
            try {
              const newToken = await authService.refreshToken();
              if (newToken) {
                console.log('✅ Token refreshed successfully');
              } else {
                console.log('⚠️ Token refresh returned no token');
              }
            } catch (refreshError) {
              console.error('❌ Token refresh failed:', refreshError);
            }
          }
        }
        
        // Check if user is authenticated via context
        if (!isAuthenticated) {
          console.log('❌ Not authenticated according to context');
          setVerificationPassed(false);
          setIsVerifying(false);
          return;
        }
        
        console.log('✅ Authentication verification passed');
        setVerificationPassed(true);
      } catch (error) {
        console.error('❌ Error during auth verification:', error);
        setVerificationPassed(false);
      } finally {
        setIsVerifying(false);
      }
    };

    if (!isLoading) {
      verifyAuth();
    }
  }, [isLoading, isAuthenticated, user, location.pathname]);

  // Show loading state
  if (isLoading || isVerifying) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mb-5"></div>
        <p className="text-white text-lg">Verifying authentication...</p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!verificationPassed || !isAuthenticated) {
    console.log('🔄 Not authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Authenticated - render children
  console.log('✅ Access granted to:', location.pathname);
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;