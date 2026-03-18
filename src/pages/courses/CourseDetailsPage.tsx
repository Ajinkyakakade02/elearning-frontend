import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../services/course.service';
import { Course, Lesson } from '../../types/course.types';
import { 
  FaArrowLeft, 
  FaClock, 
  FaUsers, 
  FaStar,
  FaBook,
  FaPlayCircle,
  FaLock,
  FaGraduationCap,
  FaChartLine,
  FaRupeeSign,
  FaCode
} from 'react-icons/fa';
import { showToast } from '../../utils/toast';

interface CourseDetailsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({ darkMode, setDarkMode }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'reviews'>('overview');

  // Special handling for courses that have sections
  useEffect(() => {
    if (courseId === '9' || courseId === '10' || courseId === '12' || courseId === '13') {
      navigate(`/courses/${courseId}/sections`, { replace: true });
      return;
    }
  }, [courseId, navigate]);

  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const numericId = Number(courseId);
      console.log(`🔍 Fetching details for course ${numericId}...`);
      
      const courseData = await courseService.getCourseById(numericId);
      console.log('✅ Course data:', courseData);
      
      if (!courseData) {
        setError('Course not found');
        setIsLoading(false);
        return;
      }
      
      setCourse({
        ...courseData,
        price: 99
      });
      
      console.log(`🔍 Fetching lessons for course ${numericId}...`);
      const lessonsData = await courseService.getCourseLessons(numericId);
      console.log(`✅ Lessons received:`, lessonsData);
      console.log(`✅ Lesson IDs:`, lessonsData.map(l => l.id));
      
      if (lessonsData.length === 0) {
        console.warn(`⚠️ No lessons found for course ${numericId}`);
      } else {
        console.log(`✅ Found ${lessonsData.length} lessons`);
      }
      
      setLessons(lessonsData || []);
      
      const enrolled = await courseService.checkEnrollment(numericId);
      console.log(`✅ Enrollment status:`, enrolled);
      setIsEnrolled(enrolled);
      
    } catch (err: any) {
      console.error('❌ Error fetching course:', err);
      setError(err.message || 'Failed to load course details');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleEnroll = async () => {
    if (!course) return;
    
    try {
      await courseService.enrollInCourse(course.id);
      setIsEnrolled(true);
      showToast.success('Successfully enrolled in course!');
    } catch (error: any) {
      console.error('Failed to enroll:', error);
      if (error.message !== 'Already enrolled') {
        showToast.error('Failed to enroll. Please try again.');
      }
    }
  };

  const handleStartLesson = (lessonId: number) => {
    console.log(`🔍 Navigating to lesson: /courses/${courseId}/learn/${lessonId}`);
    navigate(`/courses/${courseId}/learn/${lessonId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getLevelColor = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLevelIcon = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return '🌱';
      case 'intermediate': return '📈';
      case 'advanced': return '🚀';
      default: return '📚';
    }
  };

  const completedLessons = 0;
  const progress = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'Course not found'}</p>
          <button 
            onClick={handleBack} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
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
        {/* Back Button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={handleBack}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-white/90 mb-6">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👨‍🏫</span>
                <div>
                  <span className="text-sm text-white/80 block">Instructor</span>
                  <span className="font-semibold">{course.instructorName || 'Expert Faculty'}</span>
                </div>
              </div>
              
              <div 
                className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
                style={{ backgroundColor: getLevelColor(course.level) }}
              >
                <span>{getLevelIcon(course.level)}</span>
                <span>{course.level || 'Beginner'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaClock />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white block">{course.durationHours || 0}</span>
              <span className="text-gray-600 dark:text-gray-300">Hours</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white block">{lessons.length || course.totalLessons || 0}</span>
              <span className="text-gray-600 dark:text-gray-300">Lessons</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white block">{course.totalStudents?.toLocaleString() || '0'}</span>
              <span className="text-gray-600 dark:text-gray-300">Students</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaStar />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white block">{course.rating?.toFixed(1) || '4.9'}</span>
              <span className="text-gray-600 dark:text-gray-300">Rating</span>
            </div>
          </div>
        </div>

        {/* Enrollment/Progress Section */}
        {!isEnrolled ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Course Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                    <FaRupeeSign className="text-2xl" /> 99/-
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400">(Limited Time Offer)</span>
                </div>
              </div>
              <button 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 text-lg"
                onClick={handleEnroll}
              >
                <FaGraduationCap /> Enroll Now @ ₹99
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold">
                <FaChartLine className="text-blue-600" /> Your Progress
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{progress}% Complete</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex gap-6">
            {(['overview', 'content', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                className={`pb-3 px-1 font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'content' ? `Course Content (${lessons.length} lessons)` : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">What You'll Learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Arrays & Strings - Complete coverage',
                    'Linked Lists - Singly, Doubly, Circular',
                    'Stacks & Queues - Implementation & Problems',
                    'Trees & Graphs - BST, BFS, DFS, Dijkstra',
                    'Dynamic Programming - All patterns',
                    'Searching & Sorting - All algorithms'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <span className="text-green-500">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Requirements</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                  <li className="flex items-center gap-2">• Basic programming knowledge in any language</li>
                  <li className="flex items-center gap-2">• Understanding of basic mathematics</li>
                  <li className="flex items-center gap-2">• Willingness to practice and solve problems</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Description</h3>
                <p className="text-gray-700 dark:text-gray-200 mb-4">{course.description}</p>
                <p className="text-gray-700 dark:text-gray-200">This comprehensive DSA course covers all topics from basic to advanced levels with detailed explanations, code examples, and practice problems.</p>
              </div>
            </div>
          )}

          {/* Course Content Tab */}
          {activeTab === 'content' && (
            <div>
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {lessons.length} lessons • {course.durationHours || 0} total hours
              </div>
              
              {lessons.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300">No lessons available for this course yet.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Check console for debug info</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => {
                    const isLocked = !isEnrolled && !lesson.isPreview;
                    
                    return (
                      <div 
                        key={lesson.id}
                        className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-all ${
                          isLocked 
                            ? 'opacity-60 cursor-not-allowed' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer hover:shadow-md'
                        }`}
                        onClick={() => !isLocked && handleStartLesson(lesson.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-xl text-blue-600 dark:text-blue-400">
                            {isLocked ? <FaLock /> : <FaPlayCircle />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 dark:text-white">
                              Lesson {index + 1}: {lesson.title}
                            </h4>
                            {lesson.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {lesson.description.substring(0, 80)}...
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <FaClock /> {lesson.durationMinutes || 45} min
                            </span>
                            {lesson.isPreview && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
                                FREE PREVIEW
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center gap-6 mb-8">
                <div className="text-center">
                  <span className="text-5xl font-bold text-gray-800 dark:text-white block">
                    {course.rating?.toFixed(1) || '4.9'}
                  </span>
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(star => (
                      <FaStar key={star} className={star <= Math.round(course.rating || 5) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">
                    Based on {course.totalStudents || 22000} students
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Rahul Sharma</h4>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => <FaStar key={star} className="text-yellow-400" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Excellent DSA course! The explanations are very clear and the problem-solving approach is systematic.</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">2 weeks ago</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">Priya Patel</h4>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => <FaStar key={star} className="text-yellow-400" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">The DP section is amazing! Finally understood dynamic programming after this course.</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">1 month ago</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;