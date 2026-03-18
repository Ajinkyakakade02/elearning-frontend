import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { wishlistService } from '../../services/wishlist.service';
import { PRICING } from '../../constants/pricing';
import { FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';

interface WishlistHeartProps {
  courseId: number;
  courseTitle: string;
  instructorName: string;
  thumbnailUrl?: string;
  price?: number;
  size?: 'small' | 'medium' | 'large';
  onToggle?: (isInWishlist: boolean) => void;
}

const WishlistHeart: React.FC<WishlistHeartProps> = ({
  courseId,
  courseTitle,
  instructorName,
  thumbnailUrl,
  price = PRICING.COURSE_DEFAULT,
  size = 'medium',
  onToggle
}) => {
  const { isAuthenticated } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  // Size mappings
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg'
  };

  useEffect(() => {
    setIsInWishlist(wishlistService.isInWishlist(courseId));
  }, [courseId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(courseId);
        setIsInWishlist(false);
        onToggle?.(false);
      } else {
        const wishlistItem = {
          id: Date.now(),
          userId: 1,
          courseId,
          courseTitle,
          instructorName,
          price: PRICING.COURSE_DEFAULT,
          courseThumbnail: thumbnailUrl,
          addedAt: new Date().toISOString()
        };
        await wishlistService.addToWishlist(wishlistItem);
        setIsInWishlist(true);
        onToggle?.(true);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowPrice(true)}
      onMouseLeave={() => setShowPrice(false)}
    >
      {/* Price Tooltip */}
      {showPrice && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
          <div className="flex items-center gap-1">
            <span>₹{price}/-</span>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
          </div>
        </div>
      )}

      {/* Heart Button */}
      <button
        className={`
          ${sizeClasses[size]} 
          rounded-full flex items-center justify-center transition-all duration-300
          ${isInWishlist 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-110' 
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
          }
          ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        `}
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isLoading ? (
          <FaSpinner className="animate-spin" />
        ) : isInWishlist ? (
          <FaHeart className="text-lg" />
        ) : (
          <FaRegHeart className="text-lg" />
        )}
      </button>

      {/* Ripple effect on click - optional */}
      {isInWishlist && !isLoading && (
        <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></span>
      )}
    </div>
  );
};

export default WishlistHeart;