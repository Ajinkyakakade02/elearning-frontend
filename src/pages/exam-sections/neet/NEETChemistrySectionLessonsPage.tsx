import React, { useState, useEffect, useCallback } from 'react';
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
  FaRupeeSign,
  FaBolt,
  FaFlask,
  FaLeaf
} from 'react-icons/fa';
import { showToast } from '../../../utils/toast';

interface NEETChemistrySectionLessonsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const NEETChemistrySectionLessonsPage: React.FC<NEETChemistrySectionLessonsPageProps> = ({ darkMode, setDarkMode }) => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [sectionInfo, setSectionInfo] = useState({
    title: '',
    icon: <FaBolt />,
    color: '',
    description: '',
    lessonIds: [] as number[]
  });


  
  // ✅ Wrap checkEnrollment in useCallback
  const checkEnrollment = useCallback(async () => {
    try {
      const enrolled = await courseService.checkEnrollment(12);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Failed to check enrollment:', error);
      setIsEnrolled(false);
    }
  }, []); // No dependencies, as courseService is stable

  // ✅ Wrap fetchLessons in useCallback
  const fetchLessons = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Fetching lessons for NEET Chemistry course 12...');
      const allLessons = await courseService.getCourseLessons(12);
      console.log('All lessons from database:', allLessons);

      const sectionData: Record<string, { title: string; icon: JSX.Element; color: string; description: string; lessonIds: number[] }> = {
        'physical-chemistry': {
          title: 'Physical Chemistry',
          icon: <FaBolt />,
          color: '#3b82f6',
          description: 'Master Physical Chemistry for NEET with comprehensive video lectures',
          lessonIds: [701, 702, 703, 704, 705, 706]
        },
        'inorganic-chemistry': {
          title: 'Inorganic Chemistry',
          icon: <FaFlask />,
          color: '#10b981',
          description: 'Master Inorganic Chemistry for NEET with detailed concept videos',
          lessonIds: [707, 708, 709, 710, 711, 712, 713, 714, 715]
        },
        'organic-chemistry': {
          title: 'Organic Chemistry',
          icon: <FaLeaf />,
          color: '#8b5cf6',
          description: 'Master Organic Chemistry for NEET with comprehensive video lectures',
          lessonIds: [716, 717, 718, 719, 720, 721, 722, 723, 724]
        }
      };

      if (sectionId && sectionData[sectionId]) {
        setSectionInfo(sectionData[sectionId]);
        
        const filteredLessons = allLessons.filter(lesson => 
          sectionData[sectionId].lessonIds.includes(lesson.id)
        );
        
        console.log(`Filtered lessons for ${sectionId}:`, filteredLessons);
        
        if (filteredLessons.length === 0) {
          console.warn('No lessons found for section. Expected IDs:', sectionData[sectionId].lessonIds);
          console.warn('Available lesson IDs in database:', allLessons.map(l => l.id));
          showToast.info('No lessons available for this section yet');
        }
        
        filteredLessons.sort((a, b) => a.id - b.id);
        setLessons(filteredLessons);
      } else {
        console.error('Invalid section ID:', sectionId);
        setLessons([]);
      }
      
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      showToast.error('Failed to load lessons');
    } finally {
      setIsLoading(false);
    }
  }, [sectionId]); // ✅ sectionId is now a dependency

  // ✅ useEffect now has all dependencies properly listed
  useEffect(() => {
    fetchLessons();
    checkEnrollment();
  }, [fetchLessons, checkEnrollment]); // ✅ Both functions are now stable dependencies

  const handleStartLesson = (lessonId: number) => {
    navigate(`/courses/12/learn/${lessonId}`);
  };

  const handleEnroll = () => {
    navigate('/courses/12');
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
            onClick={() => navigate('/courses/12/sections')}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Sections
          </button>
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl">{sectionInfo.icon}</span>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{sectionInfo.title}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{sectionInfo.description}</p>
          
          {!isEnrolled && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold">
              <FaRupeeSign /> 99/- Complete Section
            </div>
          )}
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
                {lessons.reduce((sum, l) => sum + (l.durationMinutes || 45), 0)} min
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
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">12k+</h3>
              <p className="text-gray-600 dark:text-gray-300">Students</p>
            </div>
          </div>
        </div>

        {/* Enroll Button */}
        {!isEnrolled && (
          <div className="text-center mb-8">
            <button 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 mx-auto group"
              onClick={handleEnroll}
            >
              Enroll Now @ ₹99 <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}

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
                          <FaClock /> {lesson.durationMinutes || 45} min
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

export default NEETChemistrySectionLessonsPage;