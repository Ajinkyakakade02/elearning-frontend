import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../../services/course.service';
import { showToast } from '../../../utils/toast';
import { Lesson } from '../../../types/course.types';
import { 
  FaArrowLeft, 
  FaClock, 
  FaBook,
  FaPlayCircle,
  FaLock,
  FaUsers
} from 'react-icons/fa';

interface MHTCETChemistrySectionPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MHTCETChemistrySectionPage: React.FC<MHTCETChemistrySectionPageProps> = ({ darkMode, setDarkMode }) => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionInfo, setSectionInfo] = useState({
    title: '',
    icon: '',
    color: '',
    description: ''
  });

  useEffect(() => {
    fetchLessons();
  }, [sectionId]);

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const allLessons = await courseService.getCourseLessons(19); // MHT CET Chemistry course ID

      const lessonRanges = {
        'physical-chemistry': {
          ids: [1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908],
          info: {
            title: 'Physical Chemistry',
            icon: '⚡',
            color: '#3b82f6',
            description: 'Master Physical Chemistry concepts with comprehensive video lectures for MHT CET'
          }
        },
        'inorganic-chemistry': {
          ids: [1909, 1910, 1911, 1912, 1913, 1914, 1915],
          info: {
            title: 'Inorganic Chemistry',
            icon: '🧪',
            color: '#10b981',
            description: 'Master Inorganic Chemistry with detailed concept videos for MHT CET'
          }
        },
        'organic-chemistry': {
          ids: [1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924],
          info: {
            title: 'Organic Chemistry',
            icon: '🌿',
            color: '#8b5cf6',
            description: 'Master Organic Chemistry with comprehensive video lectures for MHT CET'
          }
        }
      };

      if (sectionId && lessonRanges[sectionId as keyof typeof lessonRanges]) {
        const range = lessonRanges[sectionId as keyof typeof lessonRanges];
        setSectionInfo(range.info);
        
        const filteredLessons = allLessons.filter(lesson => 
          range.ids.includes(lesson.id)
        );
        
        filteredLessons.sort((a, b) => a.id - b.id);
        setLessons(filteredLessons);
      }
      
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // FORWARD NAVIGATION - to lesson player
  const handleStartLesson = (lessonId: number) => {
    navigate(`/courses/19/learn/${lessonId}`);
  };

  // BACK NAVIGATION - directly to sections page
  const handleBack = () => {
    navigate('/courses/19', { replace: true });
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
        {/* Back Button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={handleBack}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Sections
          </button>
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-5xl">{sectionInfo.icon}</span>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{sectionInfo.title}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{sectionInfo.description}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl"
              style={{ background: sectionInfo.color }}
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
              style={{ background: sectionInfo.color }}
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
              style={{ background: sectionInfo.color }}
            >
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">15k+</h3>
              <p className="text-gray-600 dark:text-gray-300">Students</p>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {lessons.length} lessons in this section
          </div>
          
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">No lessons available for this section yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const isLocked = !lesson.isPreview;
                
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
                      <div className="text-xl mt-1" style={{ color: isLocked ? undefined : sectionInfo.color }}>
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
                            style={{ background: sectionInfo.color }}
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

export default MHTCETChemistrySectionPage;