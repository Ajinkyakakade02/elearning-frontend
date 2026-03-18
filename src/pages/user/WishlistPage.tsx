import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { wishlistService } from '../../services/wishlist.service';
import courseService from '../../services/course.service';
import { Course } from '../../types/course.types';
import { WishlistItem } from '../../types/wishlist.types';
import { showToast } from '../../utils/toast';
import { 
  FaArrowLeft, 
  FaClock, 
  FaUsers, 
  FaStar,
  FaBook,
  FaSearch,
  FaRupeeSign,
  FaHeart,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCheckCircle,
  FaRegCircle,
  FaShoppingCart
} from 'react-icons/fa';

interface WishlistPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // State for wishlist items
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Load wishlist on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadWishlist();
    loadAllCourses();

    const unsubscribe = wishlistService.subscribe(() => {
      setWishlistItems(wishlistService.getItems());
    });

    return unsubscribe;
  }, [isAuthenticated, navigate]);

  const loadWishlist = () => {
    const items = wishlistService.getItems();
    // Ensure all items have ₹99 price
    const updatedItems = items.map(item => ({
      ...item,
      price: 99
    }));
    setWishlistItems(updatedItems);
  };

  const loadAllCourses = async () => {
    try {
      const courses = await courseService.getAllCourses();
      // Filter out courses already in wishlist
      const wishlistIds = new Set(wishlistItems.map(item => item.courseId));
      const availableCourses = courses.filter(course => !wishlistIds.has(course.id));
      setAllCourses(availableCourses);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (courseId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      await wishlistService.removeFromWishlist(courseId);
      showToast.success('✅ Removed from wishlist');
      
      // Refresh available courses
      const courses = await courseService.getAllCourses();
      const wishlistIds = new Set(wishlistService.getItems().map(item => item.courseId));
      const availableCourses = courses.filter(course => !wishlistIds.has(course.id));
      setAllCourses(availableCourses);
    } catch (error) {
      showToast.error('❌ Failed to remove from wishlist');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      for (const item of wishlistItems) {
        await wishlistService.removeFromWishlist(item.courseId);
      }
      showToast.success('✅ Wishlist cleared');
      
      // Refresh available courses
      const courses = await courseService.getAllCourses();
      setAllCourses(courses);
    }
  };

  const handleViewCourse = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  const handleAddSelectedCourses = async () => {
    if (selectedCourses.length === 0) {
      showToast.info('Please select courses to add');
      return;
    }

    setIsAdding(true);
    let successCount = 0;
    
    for (const courseId of selectedCourses) {
      const course = allCourses.find(c => c.id === courseId);
      if (course) {
        const newItem: WishlistItem = {
          id: Date.now() + successCount,
          userId: user?.id || 1,
          courseId: course.id,
          courseTitle: course.title,
          instructorName: course.instructorName || 'Expert Faculty',
          price: 99,
          courseThumbnail: course.thumbnailUrl,
          addedAt: new Date().toISOString()
        };
        
        try {
          await wishlistService.addToWishlist(newItem);
          successCount++;
        } catch (error) {
          console.error('Failed to add course:', courseId);
        }
      }
    }

    showToast.success(`✅ Added ${successCount} course(s) to wishlist`);
    setIsAdding(false);
    setShowAddModal(false);
    setSelectedCourses([]);
    
    // Refresh lists
    loadWishlist();
    const courses = await courseService.getAllCourses();
    const wishlistIds = new Set(wishlistService.getItems().map(item => item.courseId));
    const availableCourses = courses.filter(course => !wishlistIds.has(course.id));
    setAllCourses(availableCourses);
  };

  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  const selectAllCourses = () => {
    const allIds = allCourses.map(c => c.id);
    setSelectedCourses(allIds);
  };

  const deselectAllCourses = () => {
    setSelectedCourses([]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getCourseIcon = (title: string) => {
    if (title.toLowerCase().includes('javascript')) return '🟨';
    if (title.toLowerCase().includes('react')) return '⚛️';
    if (title.toLowerCase().includes('python')) return '🐍';
    if (title.toLowerCase().includes('java')) return '☕';
    if (title.toLowerCase().includes('data')) return '📊';
    return '📚';
  };

  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button 
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              onClick={() => navigate('/dashboard')}
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            
            <div className="flex gap-2">
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowAddModal(true)}
              >
                <FaPlus /> Add Courses
              </button>
              
              {wishlistItems.length > 0 && (
                <button 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={handleClearAll}
                >
                  <FaTrash /> Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">💖</span>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-300">Courses you've saved for later ({wishlistItems.length})</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaHeart />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{wishlistItems.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Saved Courses</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{wishlistItems.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Items</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaRupeeSign />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">₹{wishlistItems.length * 99}/-</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Value</p>
            </div>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">All courses at just ₹99/-! Limited time offer.</span>
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <span className="text-6xl block mb-4">💖</span>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Save courses you're interested in for later
            </p>
            <button 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus /> Add Courses to Wishlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map(item => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="p-6 text-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                  <span className="text-5xl mb-3 block">
                    {getCourseIcon(item.courseTitle)}
                  </span>
                  <button
                    className="absolute top-4 right-4 w-8 h-8 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                    onClick={(e) => handleRemove(item.courseId, e)}
                    title="Remove from wishlist"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{item.courseTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    👨‍🏫 {item.instructorName}
                  </p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <FaClock className="text-blue-500" /> 20h
                    </span>
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <FaUsers className="text-green-500" /> 150
                    </span>
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <FaStar className="text-yellow-500" /> 4.8
                    </span>
                  </div>

                  {/* Price and Added Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                      <FaRupeeSign /> 99/-
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Added {formatDate(item.addedAt)}
                    </span>
                  </div>

                  {/* View Course Button */}
                  <button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 group"
                    onClick={() => handleViewCourse(item.courseId)}
                  >
                    View Course @ ₹99
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Courses Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add Courses to Wishlist</h2>
                <button 
                  className="text-2xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  onClick={() => setShowAddModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Search Bar */}
                <div className="relative mb-6">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses by title, instructor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
                  />
                </div>

                {/* Selection Controls */}
                {allCourses.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      onClick={selectAllCourses}
                    >
                      <FaCheckCircle /> Select All
                    </button>
                    <button 
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                      onClick={deselectAllCourses}
                    >
                      <FaTimes /> Deselect All
                    </button>
                    <div className="ml-auto px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-lg flex items-center gap-2">
                      <FaShoppingCart />
                      <span className="font-semibold">{selectedCourses.length} selected</span>
                    </div>
                  </div>
                )}

                {/* Courses Grid */}
                <div className="space-y-3">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map(course => (
                      <div 
                        key={course.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedCourses.includes(course.id)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => toggleCourseSelection(course.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">
                            {getCourseIcon(course.title)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-white">{course.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{course.instructorName || 'Expert Faculty'}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                <FaClock /> {course.durationHours || 0}h
                              </span>
                              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <FaRupeeSign /> 99/-
                              </span>
                            </div>
                          </div>
                          <div className="text-2xl">
                            {selectedCourses.includes(course.id) ? (
                              <FaCheckCircle className="text-blue-500" />
                            ) : (
                              <FaRegCircle className="text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <span className="text-6xl block mb-4">📚</span>
                      <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No courses available</h4>
                      <p className="text-gray-600 dark:text-gray-300">All courses are already in your wishlist</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button 
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedCourses([]);
                    setSearchTerm('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  onClick={handleAddSelectedCourses}
                  disabled={selectedCourses.length === 0 || isAdding}
                >
                  {isAdding ? (
                    <>Adding... <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span></>
                  ) : (
                    <>Add to Wishlist ({selectedCourses.length})</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;