import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../utils/toast';

const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const provider = location.pathname.includes('google') ? 'google' : 'github';
      
      if (!code) {
        showToast.error('Authentication failed');
        navigate('/login');
        return;
      }

      try {
        // For now, show coming soon message
        showToast.info(`${provider} login coming soon!`);
        navigate('/login');
        
        // When backend is ready, you'll implement this
        // const response = await fetch(`/api/auth/${provider}/callback?code=${code}`);
        // const data = await response.json();
        // etc...
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        showToast.error('Authentication failed');
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="relative mb-6">
          {/* Outer ring */}
          <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
          {/* Inner spinning ring */}
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          {/* Checkmark or provider icon (optional) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">
              {location.pathname.includes('google') ? '📧' : '🐙'}
            </span>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Completing Authentication
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Please wait while we securely sign you in...
        </p>

        {/* Progress bar (optional) */}
        <div className="mt-6 w-48 mx-auto">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-progress"></div>
          </div>
        </div>

        {/* Hint */}
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          {location.pathname.includes('google') 
            ? 'Redirecting from Google...' 
            : 'Redirecting from GitHub...'}
        </p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;