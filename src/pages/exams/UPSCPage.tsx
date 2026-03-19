import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  FaChalkboardTeacher,
  FaSeedling,
  FaChartBar,
  FaRocket,
  FaLandmark,
  FaBalanceScale,
  FaGlobe,
  FaHistory,
  FaLandmark as FaGovernment,
  FaGavel,
  FaChartLine,
  FaLeaf,
  FaRupeeSign
} from 'react-icons/fa';

interface UPSCPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const UPSCPage: React.FC<UPSCPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Use useMemo to prevent UPSC_COURSE_IDS from changing on every render
  const UPSC_COURSE_IDS = useMemo(() => [13], []); // Complete UPSC course

  const fetchUPSCCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const allCourses = await courseService.getAllCourses();
      console.log('All courses:', allCourses);
      
      // Filter by known UPSC course IDs
      const filtered = allCourses.filter(course => 
        UPSC_COURSE_IDS.includes(course.id)
      );
      
      console.log('Filtered UPSC courses:', filtered);
      
      // Force all courses to ₹99
      const coursesWithPrice = filtered.map(course => ({
        ...course,
        price: 99
      }));
      
      setCourses(coursesWithPrice);
      setFilteredCourses(coursesWithPrice);
    } catch (error) {
      console.error('Failed to fetch UPSC courses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [UPSC_COURSE_IDS]); // UPSC_COURSE_IDS is now stable thanks to useMemo

  // ... rest of your component code remains the same

  useEffect(() => {
    fetchUPSCCourses();
  }, [fetchUPSCCourses]);

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

  const getSubjectIcon = (title: string) => {
    if (title.toLowerCase().includes('history')) return <FaHistory />;
    if (title.toLowerCase().includes('geography')) return <FaGlobe />;
    if (title.toLowerCase().includes('polity')) return <FaGovernment />;
    if (title.toLowerCase().includes('economy')) return <FaChartLine />;
    if (title.toLowerCase().includes('environment')) return <FaLeaf />;
    if (title.toLowerCase().includes('ethics')) return <FaBalanceScale />;
    if (title.toLowerCase().includes('csat')) return <FaGavel />;
    return <FaLandmark />;
  };

  const getSubjectColor = (courseId: number) => {
    return '#8b5cf6'; // UPSC Purple
  };

  // FORWARD NAVIGATION - UPSC always goes to sections page
  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}/sections`);
  };

  // BACK NAVIGATION - to previous page (Dashboard)
  const handleBack = () => {
    navigate('/dashboard', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading UPSC courses...</p>
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">UPSC Preparation</h1>
          <p className="text-gray-600 dark:text-gray-300">Complete preparation for Civil Services Examination - All at ₹99/-</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{courses.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">UPSC Courses</p>
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
          <FaLandmark className="text-xl" />
          <span className="font-semibold">Complete UPSC course at just ₹99/-! Limited time offer.</span>
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
                placeholder="Search UPSC courses..."
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
                    {getSubjectIcon(course.title)}
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
                    <FaChalkboardTeacher /> {course.instructorName || 'Expert Faculty'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {course.description?.substring(0, 100)}...
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

                  {/* Lessons Count - UPSC has many lessons! */}
                  <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <FaBook className="inline mr-1" /> {course.totalLessons || 117} lessons
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                      <FaRupeeSign /> 99/-
                    </span>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all">
                      Start Learning @ ₹99 →
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <FaBook className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No UPSC courses found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your search or filter</p>
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

export default UPSCPage;