import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnrollButton from './EnrollButton';
import WishlistHeart from './WishlistHeart';
import { 
  FaRupeeSign, 
  FaUsers, 
  FaBook, 
  FaClock,
  FaCheckCircle 
} from 'react-icons/fa';

interface CourseCardProps {
  id: number;
  title: string;
  icon: string;
  path: string;
  description: string;
  gradient: string;
  instructorName?: string;
  price?: number;
  thumbnailUrl?: string;
  stats?: {
    students?: number;
    lessons?: number;
    duration?: string;
  };
  showEnrollButton?: boolean;
  showWishlist?: boolean;
  isEnrolled?: boolean;
  progress?: number;
  showProgress?: boolean;
  isLoading?: boolean;
  onEnrollmentChange?: (courseId: number, enrolled: boolean) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  id,
  title, 
  icon, 
  path, 
  description,
  gradient,
  instructorName = 'Instructor',
  price = 99,
  thumbnailUrl,
  stats = { students: 0, lessons: 0, duration: '0h' },
  showEnrollButton = false,
  showWishlist = true,
  isEnrolled: propIsEnrolled = false,
  progress = 0,
  showProgress = false,
  isLoading = false,
  onEnrollmentChange
}) => {
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(propIsEnrolled);

  // Update local state when prop changes
  useEffect(() => {
    setIsEnrolled(propIsEnrolled);
  }, [propIsEnrolled]);

  const handleCardClick = () => {
    navigate(path);
  };

  const handleExploreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(path);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleEnrollmentChange = (enrolled: boolean) => {
    setIsEnrolled(enrolled);
    if (onEnrollmentChange) {
      onEnrollmentChange(id, enrolled);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
        <div className="flex gap-4 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group ${
        isEnrolled ? 'ring-2 ring-green-500' : ''
      }`}
      onClick={handleCardClick}
      style={{ background: gradient }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      <div className="p-6 relative z-10">
        {/* Header with Icon and Wishlist */}
        <div className="flex justify-between items-start mb-4">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </span>
          {showWishlist && !isEnrolled && (
            <div onClick={handleWishlistClick} className="z-20">
              <WishlistHeart
                courseId={id}
                courseTitle={title}
                instructorName={instructorName}
                price={99}
                thumbnailUrl={thumbnailUrl}
                size="medium"
              />
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* Stats with Icons */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm">
          <span 
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300"
            title={`${stats.students?.toLocaleString() || 0} students enrolled`}
          >
            <FaUsers className="text-blue-500" /> {stats.students?.toLocaleString() || 0} students
          </span>
          <span 
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300"
            title={`${stats.lessons || 0} lessons available`}
          >
            <FaBook className="text-green-500" /> {stats.lessons || 0} lessons
          </span>
          <span 
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300"
            title={`Course duration: ${stats.duration || '0h'}`}
          >
            <FaClock className="text-orange-500" /> {stats.duration || '0h'}
          </span>
        </div>

        {/* Enrolled Badge - Only show when enrolled */}
        {isEnrolled && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full text-sm font-semibold mb-3">
            <FaCheckCircle /> Enrolled
          </div>
        )}

        {/* Progress Bar - Show if enrolled and progress exists */}
        {showProgress && isEnrolled && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">Progress</span>
              <span className="text-gray-800 dark:text-white font-semibold">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div onClick={(e) => e.stopPropagation()}>
          {showEnrollButton ? (
            <EnrollButton 
              courseId={id} 
              courseTitle={title}
              isEnrolled={isEnrolled}
              onEnrollmentChange={handleEnrollmentChange}
              variant="primary"
            />
          ) : (
            <button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 group/btn"
              onClick={handleExploreClick}
            >
              {isEnrolled ? 'Continue Learning' : 'Explore Now'}
              <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Card Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default CourseCard;