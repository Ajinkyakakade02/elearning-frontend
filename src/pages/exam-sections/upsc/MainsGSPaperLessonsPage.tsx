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

interface MainsGSPaperLessonsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MainsGSPaperLessonsPage: React.FC<MainsGSPaperLessonsPageProps> = ({ darkMode, setDarkMode }) => {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [paperInfo, setPaperInfo] = useState({
    title: '',
    subtitle: '',
    icon: '',
    color: '',
    description: ''
  });

  useEffect(() => {
    fetchLessons();
    checkEnrollment();
  }, [paperId]);

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
      
      // Define paper info and lesson ranges for Mains GS (IDs 841-885)
      const paperData: any = {
        'gs-paper-1': {
          title: 'GS Paper I',
          subtitle: 'Indian Heritage, Culture, History & Geography',
          icon: '🏛️',
          color: '#3b82f6',
          description: 'Complete preparation for GS Paper I',
          lessonIds: [841, 842, 843, 844, 845, 846, 847, 848, 849, 850, 851, 852]
        },
        'gs-paper-2': {
          title: 'GS Paper II',
          subtitle: 'Polity, Governance, Social Justice & International Relations',
          icon: '⚖️',
          color: '#10b981',
          description: 'Complete preparation for GS Paper II',
          lessonIds: [853, 854, 855, 856, 857, 858, 859, 860, 861, 862, 863]
        },
        'gs-paper-3': {
          title: 'GS Paper III',
          subtitle: 'Technology, Economy, Environment & Security',
          icon: '🔬',
          color: '#f59e0b',
          description: 'Complete preparation for GS Paper III',
          lessonIds: [864, 865, 866, 867, 868, 869, 870, 871, 872, 873, 874]
        },
        'gs-paper-4': {
          title: 'GS Paper IV',
          subtitle: 'Ethics, Integrity & Aptitude',
          icon: '🤝',
          color: '#8b5cf6',
          description: 'Complete preparation for GS Paper IV',
          lessonIds: [875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885]
        }
      };

      if (paperId && paperData[paperId]) {
        setPaperInfo(paperData[paperId]);
        
        // Filter lessons by IDs
        const filteredLessons = allLessons.filter(lesson => 
          paperData[paperId].lessonIds.includes(lesson.id)
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
            onClick={() => navigate('/courses/13/section/mains-gs')}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Mains GS
          </button>
        </div>

        {/* Paper Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-5xl">{paperInfo.icon}</span>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{paperInfo.title}</h1>
          </div>
          <p className="text-lg font-medium" style={{ color: paperInfo.color, marginBottom: '0.5rem' }}>
            {paperInfo.subtitle}
          </p>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{paperInfo.description}</p>
          
          {!isEnrolled && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold">
              <FaRupeeSign /> 99/- Complete Paper
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl"
              style={{ background: paperInfo.color }}
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
              style={{ background: paperInfo.color }}
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
              style={{ background: paperInfo.color }}
            >
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">15k+</h3>
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
            {lessons.length} lessons in this paper
          </div>
          
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">No lessons available for this paper yet.</p>
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
                      <div className="text-xl mt-1" style={{ color: isLocked ? undefined : paperInfo.color }}>
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
                            style={{ background: paperInfo.color }}
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

export default MainsGSPaperLessonsPage;