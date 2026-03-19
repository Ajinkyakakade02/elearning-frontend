import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../../services/course.service';
import { Course } from '../../types/course.types';
import { 
  FaClock, 
  FaUsers, 
  FaStar,
  FaSearch,
  FaArrowLeft,
  FaBook,
  FaFilter,
  FaRupeeSign,
  FaHeartbeat,
  FaAtom,
  FaFlask,
  FaDna,
  FaChalkboardTeacher,
  FaSeedling,
  FaChartBar,
  FaRocket
} from 'react-icons/fa';

interface NEETPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const NEETPage: React.FC<NEETPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // NEET course IDs from your database
  const NEET_COURSE_IDS = [10, 11, 12]; // Biology (10), Physics (11), Chemistry (12)

  const fetchNEETCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('📡 Fetching all courses...');
      const allCourses = await courseService.getAllCourses();
      console.log('✅ All courses received:', allCourses);
      
      // Log all course IDs for debugging (console only)
      const courseIds = allCourses.map(c => c.id);
      console.log('Course IDs in database:', courseIds);
      
      // Log details of courses with IDs 10, 11, 12
      const neetCourses = allCourses.filter(c => [10, 11, 12].includes(c.id));
      console.log('🔍 NEET courses (IDs 10,11,12):', neetCourses);
      
      if (neetCourses.length === 0) {
        console.warn('⚠️ No courses found with IDs 10, 11, 12');
        console.log('Available courses:', allCourses.map(c => ({ id: c.id, title: c.title })));
      }
      
      // Filter by known NEET course IDs
      const filtered = allCourses.filter(course => 
        NEET_COURSE_IDS.includes(course.id)
      );
      
      console.log('🎯 Filtered NEET courses:', filtered);
      
      // Force all courses to ₹99 and ensure they have proper structure
      const coursesWithPrice = filtered.map(course => ({
        ...course,
        price: 99,
        // Ensure these fields exist
        totalLessons: course.totalLessons || getLessonCountForCourse(course.id),
        durationHours: course.durationHours || 0,
        totalStudents: course.totalStudents || Math.floor(Math.random() * 5000) + 1000,
        rating: course.rating || 4.5,
        level: course.level || 'Beginner',
        instructorName: course.instructorName || 'Expert NEET Faculty'
      }));
      
      setCourses(coursesWithPrice);
      setFilteredCourses(coursesWithPrice);
    } catch (error) {
      console.error('❌ Failed to fetch NEET courses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [NEET_COURSE_IDS]); // Added dependency

  // Helper function to get lesson count based on course ID
  const getLessonCountForCourse = (courseId: number): number => {
    const lessonCounts: Record<number, number> = {
      10: 37, // NEET Biology - from your data (501-537)
      11: 9,  // NEET Physics - from your data (601-610)
      12: 24, // NEET Chemistry - from your data (701-724)
    };
    return lessonCounts[courseId] || 0;
  };

  useEffect(() => {
    fetchNEETCourses();
  }, [fetchNEETCourses]);

  useEffect(() => {
    let filtered = [...courses];
    if (activeFilter !== 'all') {
      filtered = filtered.filter(course => 
        course.level?.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCourses(filtered);
  }, [activeFilter, searchTerm, courses]);

  // Removed unused getLevelColor function

  const getLevelBgColor = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelIcon = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return <FaSeedling />;
      case 'intermediate': return <FaChartBar />;
      case 'advanced': return <FaRocket />;
      default: return <FaBook />;
    }
  };

  const getSubjectIcon = (courseId: number, title: string) => {
    switch(courseId) {
      case 10: return <FaDna />; // Biology
      case 11: return <FaAtom />; // Physics
      case 12: return <FaFlask />; // Chemistry
      default:
        if (title.toLowerCase().includes('biology')) return <FaDna />;
        if (title.toLowerCase().includes('physics')) return <FaAtom />;
        if (title.toLowerCase().includes('chemistry')) return <FaFlask />;
        return <FaHeartbeat />;
    }
  };

  const getSubjectColor = (courseId: number) => {
    switch(courseId) {
      case 10: return '#10b981'; // Biology - Green
      case 11: return '#3b82f6'; // Physics - Blue
      case 12: return '#8b5cf6'; // Chemistry - Purple
      default: return '#6b7280';
    }
  };

  const getSubjectName = (courseId: number) => {
    switch(courseId) {
      case 10: return 'Biology';
      case 11: return 'Physics';
      case 12: return 'Chemistry';
      default: return 'NEET';
    }
  };

  // FORWARD NAVIGATION - to specific course pages
  const handleCourseClick = (courseId: number) => {
    if (courseId === 10) { // NEET Biology
      navigate(`/courses/${courseId}/sections`);
    } else if (courseId === 12) { // NEET Chemistry
      navigate(`/courses/${courseId}/sections`);
    } else { // NEET Physics (11) goes directly
      navigate(`/courses/${courseId}`);
    }
  };

  // BACK NAVIGATION - directly to dashboard
  const handleBack = () => {
    navigate('/dashboard', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading NEET courses...</p>
        </div>
      </div>
    );
  }

  // Calculate total value
  const totalValue = courses.length * 99;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={handleBack}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">NEET Preparation</h1>
          <p className="text-gray-600 dark:text-gray-300">Complete preparation for NEET medical entrance exam - All at ₹99/-</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{courses.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">NEET Courses</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {courses.reduce((sum, course) => sum + (course.totalStudents || 0), 0)}+
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Students Enrolled</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaRupeeSign />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">₹ {totalValue}/-</h3>
              <p className="text-gray-600 dark:text-gray-300">Complete Bundle</p>
            </div>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
          <FaHeartbeat className="text-xl" />
          <span className="font-semibold">All NEET courses at just ₹99/- each! Limited time offer.</span>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          {/* Filter by Level */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-200">
              <FaFilter /> <span className="font-medium">Filter by Level:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                <FaBook className="inline mr-1" /> All
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === 'beginner'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveFilter('beginner')}
              >
                <FaSeedling className="inline mr-1" /> Beginner
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === 'intermediate'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveFilter('intermediate')}
              >
                <FaChartBar className="inline mr-1" /> Intermediate
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === 'advanced'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveFilter('advanced')}
              >
                <FaRocket className="inline mr-1" /> Advanced
              </button>
            </div>
          </div>

          {/* Search */}
          <div>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search NEET courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
              />
            </div>
            {filteredCourses.length > 0 && (
              <p className="text-right text-sm text-gray-600 dark:text-gray-400 mt-2">
                {filteredCourses.length} courses found
              </p>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                onClick={() => handleCourseClick(course.id)}
                style={{ borderTop: `4px solid ${getSubjectColor(course.id)}` }}
              >
                {/* Course Header */}
                <div 
                  className="p-6 text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${getSubjectColor(course.id)}20, ${getSubjectColor(course.id)}40)`
                  }}
                >
                  <div className="text-5xl mb-3" style={{ color: getSubjectColor(course.id) }}>
                    {getSubjectIcon(course.id, course.title)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {getSubjectName(course.id)}
                  </div>
                  <div 
                    className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold ${getLevelBgColor(course.level)}`}
                  >
                    <span className="mr-1">{getLevelIcon(course.level)}</span> {course.level || 'Beginner'}
                  </div>
                </div>
                
                {/* Course Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-1">
                    <FaChalkboardTeacher /> {course.instructorName || 'Expert NEET Faculty'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {course.description || `Complete ${getSubjectName(course.id)} preparation for NEET with comprehensive coverage of all topics.`}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <FaClock className="text-blue-500" /> {course.durationHours || 0}h
                    </span>
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <FaUsers className="text-green-500" /> {course.totalStudents || 0}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <FaStar className="text-yellow-500" /> {course.rating?.toFixed(1) || '4.5'}
                    </span>
                  </div>

                  {/* Lessons Count */}
                  <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <FaBook className="inline mr-1" /> {course.totalLessons || getLessonCountForCourse(course.id)} lessons
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                      <FaRupeeSign /> 99/-
                    </span>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all">
                      Enroll Now @ ₹99 →
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <FaBook className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No NEET courses found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {courses.length === 0 ? 'No courses match the NEET criteria.' : 'Try adjusting your search or filter'}
              </p>
              {(searchTerm || activeFilter !== 'all') && (
                <button 
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
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

export default NEETPage;