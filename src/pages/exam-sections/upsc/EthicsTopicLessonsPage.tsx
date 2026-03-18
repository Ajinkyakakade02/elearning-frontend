import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../../services/course.service';
import { Lesson } from '../../../types/course.types';
import { 
  FaArrowLeft, 
  FaClock, 
  FaBook,
  FaPlayCircle,
  FaLock,
  FaUsers,
  FaRupeeSign
} from 'react-icons/fa';

interface EthicsTopicLessonsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const EthicsTopicLessonsPage: React.FC<EthicsTopicLessonsPageProps> = ({ darkMode, setDarkMode }) => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [topicInfo, setTopicInfo] = useState({
    title: '',
    icon: '',
    color: '',
    description: ''
  });

  useEffect(() => {
    fetchLessons();
    checkEnrollment();
  }, [topicId]);

  const checkEnrollment = async () => {
    try {
      const enrolled = await courseService.checkEnrollment(13);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Failed to check enrollment:', error);
      setIsEnrolled(false);
    }
  };

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      // Fetch all lessons for course 13
      const allLessons = await courseService.getCourseLessons(13);
      
      // Define topic info and lesson ranges for Ethics (IDs 886-903)
      const topicData: any = {
        'ethics-basics': {
          title: 'Ethics & Human Values',
          icon: '❤️',
          color: '#ef4444',
          description: 'Master ethics and human values for GS Paper IV',
          lessonIds: [886, 887, 888, 889] // Human Values, Ethics Intro, etc.
        },
        'attitude-ei': {
          title: 'Attitude & Emotional Intelligence',
          icon: '🧠',
          color: '#3b82f6',
          description: 'Complete attitude and emotional intelligence',
          lessonIds: [890, 891, 892, 893] // Attitude, EI, Aptitude
        },
        'moral-thinkers': {
          title: 'Moral Thinkers',
          icon: '👤',
          color: '#8b5cf6',
          description: 'Western and Indian moral philosophers',
          lessonIds: [894, 895, 896] // Western, Indian, Comparative
        },
        'probity': {
          title: 'Probity in Governance',
          icon: '⚖️',
          color: '#10b981',
          description: 'Probity, transparency and accountability',
          lessonIds: [897, 898, 899] // Probity, Code of Conduct, Corruption
        },
        'case-studies': {
          title: 'Case Studies',
          icon: '📝',
          color: '#f59e0b',
          description: 'Practice case studies and answer writing',
          lessonIds: [900, 901, 902, 903] // Admin Case Studies, Dilemmas, Practice
        }
      };

      if (topicId && topicData[topicId]) {
        setTopicInfo(topicData[topicId]);
        
        // Filter lessons by IDs
        const filteredLessons = allLessons.filter(lesson => 
          topicData[topicId].lessonIds.includes(lesson.id)
        );
        
        // Sort by ID
        filteredLessons.sort((a, b) => a.id - b.id);
        
        setLessons(filteredLessons);
      }
      
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLesson = (lessonId: number) => {
    navigate(`/courses/13/learn/${lessonId}`);
  };

  const handleEnroll = () => {
    navigate('/courses/13');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading lessons...</p>
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
        {/* Header with back button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={() => navigate('/courses/13/section/ethics')}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Ethics
          </button>
        </div>

        {/* Topic Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-5xl">{topicInfo.icon}</span>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{topicInfo.title}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{topicInfo.description}</p>
          
          {!isEnrolled && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold">
              <FaRupeeSign /> 99/- Complete Topic
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl"
              style={{ background: topicInfo.color }}
            >
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{lessons.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Lessons</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl"
              style={{ background: topicInfo.color }}
            >
              <FaClock />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {lessons.reduce((sum, l) => sum + (l.durationMinutes || 0), 0)} min
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Total Duration</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl"
              style={{ background: topicInfo.color }}
            >
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">12k+</h3>
              <p className="text-gray-600 dark:text-gray-300">Students</p>
            </div>
          </div>
        </div>

        {/* Enroll Button if not enrolled */}
        {!isEnrolled && (
          <div className="text-center mb-8">
            <button 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 mx-auto group"
              onClick={handleEnroll}
            >
              Enroll in UPSC Course @ ₹99 <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}

        {/* Lessons List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {lessons.length} lessons in this topic
          </div>
          
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">No lessons available for this topic yet.</p>
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
                    <div className="flex items-start gap-4">
                      <div className="text-xl mt-1" style={{ color: isLocked ? undefined : topicInfo.color }}>
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
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 whitespace-nowrap">
                          <FaClock /> {lesson.durationMinutes} min
                        </span>
                        {lesson.isPreview && (
                          <span 
                            className="px-2 py-1 text-white text-xs font-semibold rounded-full whitespace-nowrap"
                            style={{ background: topicInfo.color }}
                          >
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
      </div>
    </div>
  );
};

export default EthicsTopicLessonsPage;