import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../../services/course.service';
import { Course, Enrollment } from '../../types/course.types';
import { showToast } from '../../utils/toast';
import { 
  FaArrowLeft, 
  FaBook, 
  FaClock, 
  FaPlayCircle,
  FaChartLine,
  FaUsers,
  FaRupeeSign,
  FaTrash,
  FaCheckCircle,
  FaRegCircle,
  FaTimes
} from 'react-icons/fa';

interface MyCoursesPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MyCoursesPage: React.FC<MyCoursesPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Map<number, Course>>(new Map());
  const [courseProgress, setCourseProgress] = useState<Map<number, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed'>('in-progress');
  
  // Clear enrollment states
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Fetch my courses
  const fetchMyCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Fetching enrollments...');
      
      // Get all enrollments from localStorage first
      const mockEnrollments = courseService.getMockEnrollments();
      console.log('📚 Mock enrollments from localStorage:', mockEnrollments);
      
      // Get all enrollments from API
      const enrollmentData = await courseService.getUserEnrollments();
      console.log('✅ Enrollments fetched:', enrollmentData);
      
      // Combine and deduplicate
      const allEnrollments = [...enrollmentData];
      
      // Add mock enrollments if not already present
      mockEnrollments.forEach(courseId => {
        if (!allEnrollments.some(e => e.courseId === courseId)) {
          allEnrollments.push(courseService.createMockEnrollment(courseId));
        }
      });
      
      setEnrollments(allEnrollments);

      if (allEnrollments.length === 0) {
        console.log('⚠️ No enrollments found');
        setIsLoading(false);
        return;
      }

      // For each enrollment, get course details
      const courseMap = new Map();
      const progressMap = new Map();

      for (const enrollment of allEnrollments) {
        try {
          const courseId = enrollment.courseId;
          
          if (!courseId) continue;
          
          const numericCourseId = Number(courseId);
          
          // Get course details
          let course;
          try {
            course = await courseService.getCourseById(numericCourseId);
          } catch (e) {
            // If API fails, create mock course
            console.warn(`Using mock course for ID ${numericCourseId}`);
            course = {
              id: numericCourseId,
              title: `Course ${numericCourseId}`,
              description: 'This is a demo course',
              instructorName: 'Expert Faculty',
              level: 'Intermediate',
              durationHours: 40,
              totalLessons: 25,
              price: 99,
              rating: 4.5,
              totalStudents: 1000,
              isPublished: true,
              categoryName: 'General',
              thumbnailUrl: ''
            };
          }
          
          const updatedCourse = {
            ...course,
            price: 99
          };
          
          courseMap.set(numericCourseId, updatedCourse);
          progressMap.set(numericCourseId, enrollment.progress || 0);
          
        } catch (err) {
          console.error(`❌ Failed to fetch details for course ${enrollment.courseId}:`, err);
        }
      }

      setCourses(courseMap);
      setCourseProgress(progressMap);

    } catch (err: any) {
      console.error('❌ Failed to fetch my courses:', err);
      setError(err.message || 'Failed to load your courses');
      showToast.error('Failed to load your courses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  // Sort enrollments by most recent activity
  const sortEnrollmentsByRecent = (enrollmentsToSort: Enrollment[]) => {
    return [...enrollmentsToSort].sort((a, b) => {
      const dateA = a.lastAccessed ? new Date(a.lastAccessed).getTime() : 
                   a.enrolledAt ? new Date(a.enrolledAt).getTime() : 0;
      const dateB = b.lastAccessed ? new Date(b.lastAccessed).getTime() : 
                   b.enrolledAt ? new Date(b.enrolledAt).getTime() : 0;
      return dateB - dateA;
    });
  };

  // Filter enrollments based on active tab
  const filteredEnrollments = enrollments.filter(enrollment => {
    if (!enrollment.courseId) return false;
    const progress = courseProgress.get(Number(enrollment.courseId)) || 0;
    if (activeTab === 'completed') {
      return progress >= 100;
    }
    return progress < 100;
  });

  // Apply sorting to filtered enrollments
  const sortedEnrollments = sortEnrollmentsByRecent(filteredEnrollments);

  // Calculate stats
  const totalEnrolled = enrollments.length;
  const completedCount = enrollments.filter(e => {
    if (!e.courseId) return false;
    return (courseProgress.get(Number(e.courseId)) || 0) >= 100;
  }).length;
  
  const inProgressCount = totalEnrolled - completedCount;
  
  const averageProgress = totalEnrolled > 0
    ? Math.round(
        enrollments.reduce((acc, e) => {
          if (!e.courseId) return acc;
          return acc + (courseProgress.get(Number(e.courseId)) || 0);
        }, 0) / totalEnrolled
      )
    : 0;

  // Navigate to first lesson
  const handleContinueLearning = async (courseId: number) => {
    try {
      console.log(`🔍 Fetching lessons for course ${courseId}...`);
      
      const lessons = await courseService.getCourseLessons(courseId);
      
      if (lessons && lessons.length > 0) {
        const sortedLessons = [...lessons].sort((a, b) => {
          if (a.lessonOrder && b.lessonOrder) {
            return a.lessonOrder - b.lessonOrder;
          }
          return a.id - b.id;
        });
        
        const firstLesson = sortedLessons[0];
        console.log(`✅ Navigating to lesson ${firstLesson.id}`);
        navigate(`/courses/${courseId}/learn/${firstLesson.id}`);
      } else {
        console.log('⚠️ No lessons found, going to course details');
        navigate(`/courses/${courseId}`);
      }
    } catch (error) {
      console.error('❌ Error getting lessons:', error);
      navigate(`/courses/${courseId}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getLevelColor = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLevelBgColor = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCourseIcon = (title: string) => {
    if (title.toLowerCase().includes('data structure')) return '🏗️';
    if (title.toLowerCase().includes('algorithm')) return '⚙️';
    if (title.toLowerCase().includes('python')) return '🐍';
    if (title.toLowerCase().includes('java')) return '☕';
    if (title.toLowerCase().includes('javascript')) return '🟨';
    if (title.toLowerCase().includes('react')) return '⚛️';
    return '📚';
  };

  // ===== CLEAR ENROLLMENT FUNCTIONS =====

  const handleClearAllCourses = () => {
    // Clear all enrollments from localStorage
    localStorage.removeItem('enrolledCourses');
    localStorage.removeItem('mockEnrollments');
    
    // Clear all enrollments from state
    setEnrollments([]);
    setCourses(new Map());
    setCourseProgress(new Map());
    setSelectedCourses(new Set());
    setIsSelectionMode(false);
    setShowClearModal(false);
    
    showToast.success('✅ All courses cleared successfully');
  };

  const handleClearSelectedCourses = () => {
    if (selectedCourses.size === 0) {
      showToast.info('Please select courses to clear');
      return;
    }

    // Remove selected courses from localStorage
    const savedEnrollments = localStorage.getItem('enrolledCourses');
    if (savedEnrollments) {
      const enrollments = JSON.parse(savedEnrollments);
      const updatedEnrollments = enrollments.filter((id: number) => !selectedCourses.has(id));
      localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrollments));
    }

    const savedMockEnrollments = localStorage.getItem('mockEnrollments');
    if (savedMockEnrollments) {
      const mockEnrollments = JSON.parse(savedMockEnrollments);
      const updatedMockEnrollments = mockEnrollments.filter((id: number) => !selectedCourses.has(id));
      localStorage.setItem('mockEnrollments', JSON.stringify(updatedMockEnrollments));
    }

    // Update state
    const updatedEnrollments = enrollments.filter(e => !selectedCourses.has(e.courseId));
    setEnrollments(updatedEnrollments);
    
    // Update courses map
    const updatedCourses = new Map(courses);
    selectedCourses.forEach(id => updatedCourses.delete(id));
    setCourses(updatedCourses);
    
    // Update progress map
    const updatedProgress = new Map(courseProgress);
    selectedCourses.forEach(id => updatedProgress.delete(id));
    setCourseProgress(updatedProgress);
    
    // Clear selection
    setSelectedCourses(new Set());
    setIsSelectionMode(false);
    setShowClearModal(false);
    
    showToast.success(`✅ ${selectedCourses.size} course(s) cleared successfully`);
  };

  const toggleCourseSelection = (courseId: number) => {
    const newSelection = new Set(selectedCourses);
    if (newSelection.has(courseId)) {
      newSelection.delete(courseId);
    } else {
      newSelection.add(courseId);
    }
    setSelectedCourses(newSelection);
  };

  const selectAllCourses = () => {
    const allCourseIds = enrollments.map(e => e.courseId).filter((id): id is number => id !== undefined);
    setSelectedCourses(new Set(allCourseIds));
  };

  const deselectAllCourses = () => {
    setSelectedCourses(new Set());
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedCourses(new Set());
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your courses...</p>
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
            
            {/* Clear Mock Enrollments Button */}
            <button 
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => setShowClearModal(true)}
            >
              <FaTrash /> Clear Enrollments
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Courses</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your learning progress and continue where you left off</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalEnrolled}</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Enrolled</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaPlayCircle />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{inProgressCount}</h3>
              <p className="text-gray-600 dark:text-gray-300">In Progress</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaChartLine />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{completedCount}</h3>
              <p className="text-gray-600 dark:text-gray-300">Completed</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaChartLine />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{averageProgress}%</h3>
              <p className="text-gray-600 dark:text-gray-300">Avg Progress</p>
            </div>
          </div>
        </div>

        {/* Selection Mode Controls - Only show when there are enrollments */}
        {enrollments.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              {isSelectionMode ? (
                <>
                  <button 
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={selectAllCourses}
                  >
                    Select All
                  </button>
                  <button 
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={deselectAllCourses}
                  >
                    Deselect All
                  </button>
                  
                  <button 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleClearSelectedCourses}
                    disabled={selectedCourses.size === 0}
                  >
                    <FaTrash className="inline mr-2" /> Clear Selected ({selectedCourses.size})
                  </button>
                  
                  <button 
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={exitSelectionMode}
                  >
                    Cancel
                  </button>
                  
                  <span className="text-sm text-gray-600 dark:text-gray-300 ml-auto">
                    {selectedCourses.size} selected
                  </span>
                </>
              ) : (
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setIsSelectionMode(true)}
                >
                  Select Courses
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tabs for filtering */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'in-progress'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab('in-progress')}
            >
              📚 In Progress ({inProgressCount})
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'completed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              ✅ Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        {sortedEnrollments.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <span className="text-6xl block mb-4">📚</span>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No courses found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {activeTab === 'completed' 
                ? "You haven't completed any courses yet. Keep learning!"
                : "You haven't enrolled in any courses yet."}
            </p>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              onClick={() => navigate('/courses')}
            >
              Browse Courses (₹99/- each)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEnrollments.map(enrollment => {
              if (!enrollment.courseId) return null;
              
              const course = courses.get(Number(enrollment.courseId));
              const progress = courseProgress.get(Number(enrollment.courseId)) || 0;
              const isSelected = selectedCourses.has(enrollment.courseId);
              
              if (!course) {
                return (
                  <div key={enrollment.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <p className="text-gray-600 dark:text-gray-300">Loading course details...</p>
                  </div>
                );
              }

              return (
                <div 
                  key={enrollment.id} 
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
                    isSelectionMode 
                      ? isSelected 
                        ? 'ring-4 ring-blue-500 cursor-pointer' 
                        : 'opacity-75 hover:opacity-100 cursor-pointer'
                      : 'hover:shadow-2xl hover:-translate-y-1'
                  }`}
                  onClick={() => isSelectionMode && toggleCourseSelection(enrollment.courseId!)}
                >
                  {/* Selection Checkbox - Only visible in selection mode */}
                  {isSelectionMode && (
                    <div className="absolute top-4 left-4 z-10">
                      {isSelected ? (
                        <FaCheckCircle className="text-2xl text-blue-500" />
                      ) : (
                        <FaRegCircle className="text-2xl text-gray-400" />
                      )}
                    </div>
                  )}

                  {/* Course Header with Gradient Background */}
                  <div 
                    className="p-6 text-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${getLevelColor(course.level)}20, ${getLevelColor(course.level)}40)`
                    }}
                  >
                    <span className="text-5xl mb-3 block">
                      {getCourseIcon(course.title)}
                    </span>
                    <div 
                      className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold ${getLevelBgColor(course.level)}`}
                    >
                      {course.level || 'Beginner'}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2" title={course.title}>
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <span className="mr-2">👨‍🏫</span> {course.instructorName || 'Expert Faculty'}
                    </p>

                    {/* Price Display */}
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold mb-4">
                      <FaRupeeSign /> 99/-
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">Progress</span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <FaClock className="text-blue-500" /> {course.durationHours || 0}h
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <FaBook className="text-green-500" /> {course.totalLessons || 0}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <FaUsers className="text-orange-500" /> {course.totalStudents || 0}
                      </span>
                    </div>

                    {/* Last Accessed */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      📅 Last accessed: {formatDate(enrollment.lastAccessed)}
                    </div>

                    {/* Continue Learning Button */}
                    {!isSelectionMode && (
                      <button 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 group"
                        onClick={() => handleContinueLearning(Number(enrollment.courseId))}
                      >
                        <FaPlayCircle /> Continue Learning
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Clear Enrollments Modal */}
        {showClearModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowClearModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Clear Enrollments</h2>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" onClick={() => setShowClearModal(false)}>
                  <FaTimes />
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">Choose how you want to clear enrollments:</p>
              
              <div className="space-y-3">
                <button 
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  onClick={handleClearAllCourses}
                >
                  <FaTrash /> Clear All Courses
                </button>
                
                <button 
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    setShowClearModal(false);
                    setIsSelectionMode(true);
                  }}
                  disabled={enrollments.length === 0}
                >
                  <FaCheckCircle /> Clear Selected Courses
                </button>
              </div>

              {enrollments.length > 0 && (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  You have {enrollments.length} enrolled course(s). 
                  Select "Clear Selected Courses" to choose specific courses.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;