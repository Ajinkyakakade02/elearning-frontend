// ============================================
// Toast Notifications
// Beautiful floating notifications
// ============================================

import toast from 'react-hot-toast';

export const showToast = {
  /**
   * Show success message
   * @param message - Success message to display
   */
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: 'white',
        padding: '16px 20px',
        borderRadius: '10px',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
      },
      icon: '✅',
      iconTheme: {
        primary: '#10b981',
        secondary: 'white',
      },
    });
  },

  /**
   * Show error message
   * @param message - Error message to display
   */
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: 'white',
        padding: '16px 20px',
        borderRadius: '10px',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
      },
      icon: '❌',
      iconTheme: {
        primary: '#ef4444',
        secondary: 'white',
      },
    });
  },

  /**
   * Show info message
   * @param message - Info message to display
   */
  info: (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: 'white',
        padding: '16px 20px',
        borderRadius: '10px',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
      },
      icon: 'ℹ️',
    });
  },

  /**
   * Show warning message
   * @param message - Warning message to display
   */
  warning: (message: string) => {
    toast(message, {
      duration: 3500,
      position: 'top-right',
      style: {
        background: '#f59e0b',
        color: 'white',
        padding: '16px 20px',
        borderRadius: '10px',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
      },
      icon: '⚠️',
    });
  },

  /**
   * Show loading toast for async operations
   * @param promise - The promise to track
   * @param messages - Loading, success, and error messages
   */
  promise: async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<T> => {
    return toast.promise(promise, messages, {
      loading: {
        duration: Infinity,
        style: {
          background: '#3b82f6',
          color: 'white',
          padding: '16px 20px',
          borderRadius: '10px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
        },
        icon: '⏳',
      },
      success: {
        duration: 3000,
        style: {
          background: '#10b981',
          color: 'white',
          padding: '16px 20px',
          borderRadius: '10px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
        },
        icon: '✅',
      },
      error: {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          padding: '16px 20px',
          borderRadius: '10px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
        },
        icon: '❌',
      },
    });
  },

  /**
   * Show custom toast
   * @param message - Message to display
   * @param type - Toast type
   */
  custom: (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6',
      warning: '#f59e0b',
    };

    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️',
    };

    toast(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: colors[type],
        color: 'white',
        padding: '16px 20px',
        borderRadius: '10px',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
      },
      icon: icons[type],
    });
  },

  /**
   * Dismiss all toasts
   */
  dismiss: () => {
    toast.dismiss();
  },
};