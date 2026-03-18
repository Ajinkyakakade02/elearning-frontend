import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../../services/course.service';
import { Course } from '../../types/course.types';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../utils/toast';
import { 
  FaClock, 
  FaUsers, 
  FaStar,
  FaSearch,
  FaArrowLeft,
  FaBook,
  FaFilter,
  FaGraduationCap,
  FaChartLine,
  FaRupeeSign,
  FaCheckCircle,
  FaBolt,
  FaHeartbeat,
  FaLandmark,
  FaLaptopCode,
  FaGlobe,
  FaSeedling,
  FaRocket,
  FaChartBar
} from 'react-icons/fa';

interface CoursesPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLevel, setActiveLevel] = useState<string>('all');
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<number>>(new Set());

  // Load enrolled courses from localStorage on mount
  useEffect(() => {
    const savedEnrollments = localStorage.getItem('enrolledCourses');
    if (savedEnrollments) {
      try {
        const parsed = JSON.parse(savedEnrollments);
        setEnrolledCourses(new Set(parsed));
        console.log('📚 Loaded enrolled courses:', parsed);
      } catch (e) {
        console.error('Error loading enrollments:', e);
      }
    }
  }, []);

  // Save enrolled courses to localStorage whenever they change
  useEffect(() => {
    if (enrolledCourses.size > 0) {
      localStorage.setItem('enrolledCourses', JSON.stringify(Array.from(enrolledCourses)));
      console.log('💾 Saved enrolled courses:', Array.from(enrolledCourses));
    }
  }, [enrolledCourses]);

  const categories = [
    { id: 'all', name: 'All Courses', icon: <FaBook /> },
    { id: 'JEE', name: 'JEE', icon: <FaBolt /> },
    { id: 'NEET', name: 'NEET', icon: <FaHeartbeat /> },
    { id: 'UPSC', name: 'UPSC', icon: <FaLandmark /> },
    { id: 'DSA', name: 'DSA', icon: <FaLaptopCode /> },
    { id: 'Web Development', name: 'Web Development', icon: <FaGlobe /> }
  ];

  const levels = [
    { id: 'all', name: 'All Levels', icon: <FaBook /> },
    { id: 'Beginner', name: 'Beginner', icon: <FaSeedling /> },
    { id: 'Intermediate', name: 'Intermediate', icon: <FaChartBar /> },
    { id: 'Advanced', name: 'Advanced', icon: <FaRocket /> }
  ];

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    setIsLoading(true);
    try {
      const allCourses = await courseService.getAllCourses();
      
      const updatedCourses = allCourses.map(course => ({
        ...course,
        price: 99
      }));
      
      setCourses(updatedCourses);
      setFilteredCourses(updatedCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      showToast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...courses];
    
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(course => 
        course.categoryName?.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }
    
    if (activeLevel !== 'all') {
      filtered = filtered.filter(course => 
        course.level?.toLowerCase() === activeLevel.toLowerCase()
      );
    }
    
    setFilteredCourses(filtered);
  }, [searchTerm, activeCategory, activeLevel, courses]);

  const handleEnroll = async (courseId: number, isFree: boolean = false) => {
    if (!isAuthenticated) {
      showToast.error('Please login to enroll');
      navigate('/login', { state: { from: `/courses/${courseId}` } });
      return;
    }

    setEnrollingId(courseId);
    try {
      if (isFree) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setEnrolledCourses(prev => {
          const newSet = new Set(prev);
          newSet.add(courseId);
          return newSet;
        });
        
        courseService.storeEnrollmentLocally(courseId);
        showToast.success('✅ Successfully enrolled in free course!');
      } else {
        const enrollment = await courseService.enrollInCourse(courseId);
        
        setEnrolledCourses(prev => {
          const newSet = new Set(prev);
          newSet.add(courseId);
          return newSet;
        });
        
        showToast.success('✅ Successfully enrolled in course!');
      }
    } catch (error: any) {
      console.error('❌ Enrollment error:', error);
      
      if (error.message === 'Already enrolled' || error.response?.data?.message?.includes('already enrolled')) {
        setEnrolledCourses(prev => {
          const newSet = new Set(prev);
          newSet.add(courseId);
          return newSet;
        });
        showToast.info('You are already enrolled in this course');
      } else {
        showToast.error('Failed to enroll. Please try again.');
      }
    } finally {
      setEnrollingId(null);
    }
  };

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
        navigate(`/courses/${courseId}/learn/${firstLesson.id}`);
      } else {
        navigate(`/courses/${courseId}`);
      }
    } catch (error) {
      console.error('❌ Error getting lessons:', error);
      navigate(`/courses/${courseId}`);
    }
  };

  const handleCourseClick = (courseId: number) => {
    if (enrolledCourses.has(courseId)) {
      handleContinueLearning(courseId);
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  const handleBack = () => {
    navigate('/dashboard', { replace: true });
  };

  const getCategoryIcon = (categoryName: string) => {
    if (!categoryName) return <FaBook />;
    const name = categoryName.toLowerCase();
    if (name.includes('jee')) return <FaBolt />;
    if (name.includes('neet')) return <FaHeartbeat />;
    if (name.includes('upsc')) return <FaLandmark />;
    if (name.includes('dsa')) return <FaLaptopCode />;
    if (name.includes('web')) return <FaGlobe />;
    return <FaBook />;
  };

  const getLevelIcon = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return <FaSeedling />;
      case 'intermediate': return <FaChartBar />;
      case 'advanced': return <FaRocket />;
      default: return <FaBook />;
    }
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
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading courses...</p>
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
        {/* Header */}
        <div className="mb-8">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
            onClick={handleBack}
          >
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">All Courses</h1>
          <p className="text-gray-600 dark:text-gray-300">Browse and enroll in courses across all categories</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{courses.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Courses</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0).toLocaleString()}+
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Total Students</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaGraduationCap />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {courses.reduce((sum, c) => sum + (c.totalLessons || 0), 0)}+
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Total Lessons</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaStar />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {(courses.reduce((sum, c) => sum + (c.rating || 0), 0) / (courses.length || 1)).toFixed(1)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          {/* Search */}
          <div className="relative mb-6">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses by title, description, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
            />
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-200">
              <FaFilter /> <span className="font-medium">Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    activeCategory === cat.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filters */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-200">
              <FaChartLine /> <span className="font-medium">Level:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {levels.map(level => (
                <button
                  key={level.id}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    activeLevel === level.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setActiveLevel(level.id)}
                >
                  <span>{level.icon}</span>
                  {level.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-right text-sm text-gray-600 dark:text-gray-400">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
              const isEnrolled = enrolledCourses.has(course.id);
              
              return (
                <div 
                  key={course.id} 
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
                    isEnrolled ? 'border-2 border-green-500' : ''
                  }`}
                  onClick={() => handleCourseClick(course.id)}
                >
                  {/* Card Header */}
                  <div className="p-6 pb-0">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-4xl">
                        {getCategoryIcon(course.categoryName)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getLevelBgColor(course.level)}`}>
                        {getLevelIcon(course.level)} {course.level || 'Beginner'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <FaUsers className="inline mr-1" /> {course.instructorName || 'Expert Faculty'}
                    </p>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {course.description?.substring(0, 100)}...
                    </p>
                    
                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <FaClock className="text-blue-500" /> {course.durationHours || 0}h
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <FaBook className="text-green-500" /> {course.totalLessons || 0}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <FaUsers className="text-orange-500" /> {course.totalStudents?.toLocaleString() || 0}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <FaStar className="text-yellow-500" /> {course.rating?.toFixed(1) || '0.0'}
                      </div>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-700 mt-4">
                    {isEnrolled ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                          <FaCheckCircle /> Enrolled
                        </div>
                        <button 
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContinueLearning(course.id);
                          }}
                        >
                          Continue Learning →
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button 
                          className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnroll(course.id, true);
                          }}
                          disabled={enrollingId === course.id}
                        >
                          {enrollingId === course.id ? 'Enrolling...' : 'Free Enroll'}
                        </button>

                        <button 
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnroll(course.id, false);
                          }}
                          disabled={enrollingId === course.id}
                        >
                          {enrollingId === course.id ? (
                            'Enrolling...'
                          ) : (
                            <>
                              Enroll Now <FaRupeeSign /> 99 →
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <FaSearch className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No courses found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your search or filters</p>
              {(searchTerm || activeCategory !== 'all' || activeLevel !== 'all') && (
                <button 
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                    setActiveLevel('all');
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;