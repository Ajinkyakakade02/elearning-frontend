import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import courseService from '../../services/course.service';
import { paymentService } from '../../services/payment.service';
import { 
  FaRupeeSign, 
  FaPlay, 
  FaBook, 
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationCircle,
  FaTimes
} from 'react-icons/fa';

interface EnrollButtonProps {
  courseId: number;
  courseTitle: string;
  isEnrolled?: boolean;
  variant?: 'primary' | 'outline' | 'small';
  onEnrollSuccess?: () => void;
  onEnrollmentChange?: (enrolled: boolean) => void;
}

const EnrollButton: React.FC<EnrollButtonProps> = ({ 
  courseId, 
  courseTitle,
  isEnrolled = false,
  variant = 'primary',
  onEnrollSuccess,
  onEnrollmentChange
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    small: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 text-sm py-1.5 px-3'
  };

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: `/courses/${courseId}`,
          message: 'Please login to enroll in this course' 
        } 
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmEnroll = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    setShowConfirm(false);

    try {
      await paymentService.purchaseCourse(courseId, 'CARD');
      const enrollment = await courseService.enrollInCourse(courseId);
      
      if (onEnrollmentChange) {
        onEnrollmentChange(true);
      }
      
      setMessage({ 
        type: 'success', 
        text: `✅ Successfully enrolled in "${courseTitle}" for ₹99!` 
      });

      if (onEnrollSuccess) {
        onEnrollSuccess();
      }

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      console.log('Enrollment successful:', enrollment);
    } catch (error: any) {
      console.error('Enrollment error:', error);
      
      if (error.message === 'Already enrolled') {
        if (onEnrollmentChange) {
          onEnrollmentChange(true);
        }
        setMessage({ type: 'info', text: 'You are already enrolled in this course' });
      } else {
        setMessage({ type: 'error', text: `❌ ${error.message || 'Failed to enroll'}` });
      }

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEnroll = () => {
    setShowConfirm(false);
  };

  const handleViewCourse = () => {
    navigate(`/courses/${courseId}/learn`);
  };

  // Message type styles
  const messageStyles = {
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
  };

  if (isEnrolled) {
    return (
      <div className="relative">
        <button
          onClick={handleViewCourse}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-all group ${
            variantStyles[variant]
          } ${isEnrolled ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : ''}`}
        >
          <FaPlay className="text-sm" />
          Continue Learning
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <p className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
          <FaCheckCircle /> You're enrolled in this course
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Message Toast */}
      {message.text && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slideIn ${
          messageStyles[message.type as keyof typeof messageStyles]
        }`}>
          {message.type === 'success' && <FaCheckCircle className="text-lg" />}
          {message.type === 'error' && <FaExclamationCircle className="text-lg" />}
          {message.type === 'info' && <FaInfoCircle className="text-lg" />}
          <span className="text-sm font-medium">{message.text}</span>
          <button 
            onClick={() => setMessage({ type: '', text: '' })}
            className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-scaleIn">
            <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Enroll in Course</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Are you sure you want to enroll in:</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">"{courseTitle}"?</p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold mb-6">
              <FaRupeeSign /> 99/-
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmEnroll}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : (
                  'Yes, Pay ₹99 & Enroll'
                )}
              </button>
              <button 
                onClick={handleCancelEnroll}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Button */}
      <button
        onClick={handleEnrollClick}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-all group ${
          variantStyles[variant]
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            Processing...
          </>
        ) : (
          <>
            <FaBook className="text-sm" />
            Enroll for ₹99
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </>
        )}
      </button>

      {/* Login Hint */}
      {!isAuthenticated && (
        <p className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 mt-1">
          <FaInfoCircle /> Please login to enroll in this course
        </p>
      )}
    </div>
  );
};

export default EnrollButton;