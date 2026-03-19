import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import courseService from '../../services/course.service';
import { quizService } from '../../services/quiz.service';
import { Course, Lesson } from '../../types/course.types';
import YouTubePlayer from '../../components/core/YouTubePlayer';
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaClock, 
  FaBook,
  FaPlayCircle,
  FaTrophy,
  FaLock,
  FaStar,
  FaUsers,
  FaGraduationCap,
  FaRupeeSign
} from 'react-icons/fa';

interface LessonDetailsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const LessonDetailsPage: React.FC<LessonDetailsPageProps> = ({ darkMode, setDarkMode }) => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [hasQuiz, setHasQuiz] = useState(false);
  const [quizId, setQuizId] = useState<number | null>(null);
  const [checkingQuiz, setCheckingQuiz] = useState(false);

  const fetchInProgress = useRef(false);

  // ===== COMPLETE HELPER FUNCTION: Determine subject based on lesson ID =====
  const getSubjectFromLessonId = (id: number): string => {
    // Course 4 - Arrays Masterclass
    if (id === 401) return 'dsa-arrays';
    
    // DSA (Course 22)
    if (id >= 2201 && id <= 2215) return 'dsa';
    
    // MHT CET Physics
    if (id >= 1801 && id <= 1825) return 'mhtcet-physics';
    
    // MHT CET Chemistry
    if (id >= 1901 && id <= 1908) return 'mhtcet-physical-chemistry';
    if (id >= 1909 && id <= 1915) return 'mhtcet-inorganic-chemistry';
    if (id >= 1916 && id <= 1924) return 'mhtcet-organic-chemistry';
    
    // MHT CET Biology
    if (id >= 2101 && id <= 2108) return 'mhtcet-botany';
    if (id >= 2109 && id <= 2117) return 'mhtcet-zoology';
    if (id >= 2118 && id <= 2127) return 'mhtcet-biotech';
    
    // MHT CET Mathematics
    if (id >= 2001 && id <= 2024) return 'mhtcet-mathematics';
    
    // JEE Chemistry
    if (id >= 96 && id <= 108) return 'physical-chemistry';
    if (id >= 109 && id <= 119) return 'inorganic-chemistry';
    if (id >= 120 && id <= 123) return 'organic-chemistry';
    
    // JEE Mathematics
    if (id >= 124 && id <= 152) return 'jee-mathematics';
    
    // JEE Physics
    if (id >= 153 && id <= 178) return 'jee-physics';
    
    // NEET Biology
    if (id >= 501 && id <= 510) return 'botany';
    if (id >= 511 && id <= 524) return 'zoology';
    if (id >= 525 && id <= 537) return 'biotech-genetics';
    
    // NEET Physics
    if (id >= 601 && id <= 610) return 'neet-physics';
    
    // NEET Chemistry
    if (id >= 701 && id <= 706) return 'neet-physical-chemistry';
    if (id >= 707 && id <= 715) return 'neet-inorganic-chemistry';
    if (id >= 716 && id <= 724) return 'neet-organic-chemistry';
    
    // UPSC Prelims
    if (id >= 801 && id <= 810) return 'indian-history';
    if (id >= 811 && id <= 815) return 'indian-geography';
    if (id >= 816 && id <= 820) return 'indian-polity';
    if (id >= 821 && id <= 823) return 'indian-economy';
    if (id >= 824 && id <= 826) return 'environment';
    if (id >= 827 && id <= 828) return 'general-science';
    
    // UPSC CSAT
    if (id >= 829 && id <= 830) return 'comprehension';
    if (id >= 831 && id <= 834) return 'logical-reasoning';
    if (id >= 835 && id <= 837) return 'quantitative-aptitude';
    if (id >= 838 && id <= 839) return 'data-interpretation';
    if (id === 840) return 'decision-making';
    
    // UPSC Mains
    if (id >= 841 && id <= 852) return 'gs-paper-1';
    if (id >= 853 && id <= 863) return 'gs-paper-2';
    if (id >= 864 && id <= 874) return 'gs-paper-3';
    if (id >= 875 && id <= 885) return 'gs-paper-4';
    
    // UPSC Ethics
    if (id >= 886 && id <= 889) return 'ethics-basics';
    if (id >= 890 && id <= 893) return 'attitude-ei';
    if (id >= 894 && id <= 896) return 'moral-thinkers';
    if (id >= 897 && id <= 899) return 'probity';
    if (id >= 900 && id <= 903) return 'case-studies';
    
    // UPSC Essay
    if (id >= 904 && id <= 910) return 'essay-writing';
    if (id >= 911 && id <= 917) return 'optional-subject';
    
    return 'other';
  };

  // Get subject display name and color
  const getSubjectInfo = (id: number) => {
    const subject = getSubjectFromLessonId(id);
    
    const subjectInfo: Record<string, { name: string; icon: string; color: string }> = {
      // Course 4 - Arrays
      'dsa-arrays': { name: 'Arrays', icon: '📊', color: '#4299e1' },
      
      // DSA
      'dsa': { name: 'Data Structures & Algorithms', icon: '💻', color: '#4299e1' },
      
      // MHT CET Physics
      'mhtcet-physics': { name: 'Physics', icon: '⚛️', color: '#4299e1' },
      
      // MHT CET Chemistry
      'mhtcet-physical-chemistry': { name: 'Physical Chemistry', icon: '⚡', color: '#3b82f6' },
      'mhtcet-inorganic-chemistry': { name: 'Inorganic Chemistry', icon: '🧪', color: '#10b981' },
      'mhtcet-organic-chemistry': { name: 'Organic Chemistry', icon: '🌿', color: '#8b5cf6' },
      
      // MHT CET Biology
      'mhtcet-botany': { name: 'Botany', icon: '🌿', color: '#10b981' },
      'mhtcet-zoology': { name: 'Zoology', icon: '🦁', color: '#f59e0b' },
      'mhtcet-biotech': { name: 'Biotechnology & Genetics', icon: '🧬', color: '#8b5cf6' },
      
      // MHT CET Mathematics
      'mhtcet-mathematics': { name: 'Mathematics', icon: '📐', color: '#f59e0b' },
      
      // JEE
      'physical-chemistry': { name: 'Physical Chemistry', icon: '⚡', color: '#3b82f6' },
      'inorganic-chemistry': { name: 'Inorganic Chemistry', icon: '🧪', color: '#10b981' },
      'organic-chemistry': { name: 'Organic Chemistry', icon: '🌿', color: '#8b5cf6' },
      'jee-mathematics': { name: 'Mathematics', icon: '📐', color: '#f59e0b' },
      'jee-physics': { name: 'Physics', icon: '⚛️', color: '#4299e1' },
      
      // NEET
      'botany': { name: 'Botany', icon: '🌿', color: '#10b981' },
      'zoology': { name: 'Zoology', icon: '🦁', color: '#f59e0b' },
      'biotech-genetics': { name: 'Biotechnology', icon: '🧬', color: '#8b5cf6' },
      'neet-physics': { name: 'Physics', icon: '⚛️', color: '#4299e1' },
      'neet-physical-chemistry': { name: 'Physical Chemistry', icon: '⚡', color: '#3b82f6' },
      'neet-inorganic-chemistry': { name: 'Inorganic Chemistry', icon: '🧪', color: '#10b981' },
      'neet-organic-chemistry': { name: 'Organic Chemistry', icon: '🌿', color: '#8b5cf6' },
      
      // UPSC Prelims
      'indian-history': { name: 'Indian History', icon: '🏛️', color: '#3b82f6' },
      'indian-geography': { name: 'Indian Geography', icon: '⛰️', color: '#10b981' },
      'indian-polity': { name: 'Indian Polity', icon: '⚖️', color: '#8b5cf6' },
      'indian-economy': { name: 'Indian Economy', icon: '📈', color: '#f59e0b' },
      'environment': { name: 'Environment', icon: '🌍', color: '#14b8a6' },
      'general-science': { name: 'General Science', icon: '🔬', color: '#ec4899' },
      
      // UPSC CSAT
      'comprehension': { name: 'Comprehension', icon: '📖', color: '#3b82f6' },
      'logical-reasoning': { name: 'Logical Reasoning', icon: '🧩', color: '#10b981' },
      'quantitative-aptitude': { name: 'Quantitative Aptitude', icon: '🧮', color: '#f59e0b' },
      'data-interpretation': { name: 'Data Interpretation', icon: '📊', color: '#8b5cf6' },
      'decision-making': { name: 'Decision Making', icon: '⚖️', color: '#ec4899' },
      
      // UPSC Mains
      'gs-paper-1': { name: 'GS Paper I', icon: '🏛️', color: '#3b82f6' },
      'gs-paper-2': { name: 'GS Paper II', icon: '⚖️', color: '#10b981' },
      'gs-paper-3': { name: 'GS Paper III', icon: '🔬', color: '#f59e0b' },
      'gs-paper-4': { name: 'GS Paper IV', icon: '🤝', color: '#8b5cf6' },
      
      // UPSC Ethics
      'ethics-basics': { name: 'Ethics Basics', icon: '❤️', color: '#ef4444' },
      'attitude-ei': { name: 'Attitude & EI', icon: '🧠', color: '#3b82f6' },
      'moral-thinkers': { name: 'Moral Thinkers', icon: '👤', color: '#8b5cf6' },
      'probity': { name: 'Probity', icon: '⚖️', color: '#10b981' },
      'case-studies': { name: 'Case Studies', icon: '📝', color: '#f59e0b' },
      
      // UPSC Essay
      'essay-writing': { name: 'Essay Writing', icon: '✍️', color: '#8b5cf6' },
      'optional-subject': { name: 'Optional Subject', icon: '📚', color: '#ec4899' },
      
      'other': { name: 'Lesson', icon: '📚', color: '#6b7280' }
    };
    
    return subjectInfo[subject] || subjectInfo['other'];
  };

  // Check if lesson is preview (handles multiple data types)
  // Check if lesson is preview (type-safe version)
const isPreviewLesson = (lesson: Lesson | null): boolean => {
  if (!lesson) return false;
  
  const preview = lesson.isPreview;
  
  // Handle different possible types from API
  if (typeof preview === 'boolean') {
    return preview === true;
  }
  
  if (typeof preview === 'number') {
    return preview === 1;
  }
  
  if (typeof preview === 'string') {
    return preview === '1' || preview === 'true' || preview === '1.0';
  }
  
  return false;
};

  // Filter lessons based on current lesson's subject
  const getFilteredLessons = (allLessons: Lesson[], currentLessonId: number): Lesson[] => {
    const subject = getSubjectFromLessonId(currentLessonId);
    
    // For course 4 (Arrays), return all lessons
    if (Number(courseId) === 4) {
      return allLessons;
    }
    
    return allLessons.filter(lesson => {
      // DSA (Course 22)
      if (subject === 'dsa') return lesson.id >= 2201 && lesson.id <= 2215;
      
      // MHT CET Physics
      if (subject === 'mhtcet-physics') return lesson.id >= 1801 && lesson.id <= 1825;
      
      // MHT CET Chemistry
      if (subject === 'mhtcet-physical-chemistry') return lesson.id >= 1901 && lesson.id <= 1908;
      if (subject === 'mhtcet-inorganic-chemistry') return lesson.id >= 1909 && lesson.id <= 1915;
      if (subject === 'mhtcet-organic-chemistry') return lesson.id >= 1916 && lesson.id <= 1924;
      
      // MHT CET Biology
      if (subject === 'mhtcet-botany') return lesson.id >= 2101 && lesson.id <= 2108;
      if (subject === 'mhtcet-zoology') return lesson.id >= 2109 && lesson.id <= 2117;
      if (subject === 'mhtcet-biotech') return lesson.id >= 2118 && lesson.id <= 2127;
      
      // MHT CET Mathematics
      if (subject === 'mhtcet-mathematics') return lesson.id >= 2001 && lesson.id <= 2024;
      
      if (subject === 'physical-chemistry') return lesson.id >= 96 && lesson.id <= 108;
      if (subject === 'inorganic-chemistry') return lesson.id >= 109 && lesson.id <= 119;
      if (subject === 'organic-chemistry') return lesson.id >= 120 && lesson.id <= 123;
      if (subject === 'jee-mathematics') return lesson.id >= 124 && lesson.id <= 152;
      if (subject === 'jee-physics') return lesson.id >= 153 && lesson.id <= 178;
      if (subject === 'botany') return lesson.id >= 501 && lesson.id <= 510;
      if (subject === 'zoology') return lesson.id >= 511 && lesson.id <= 524;
      if (subject === 'biotech-genetics') return lesson.id >= 525 && lesson.id <= 537;
      if (subject === 'neet-physics') return lesson.id >= 601 && lesson.id <= 610;
      if (subject === 'neet-physical-chemistry') return lesson.id >= 701 && lesson.id <= 706;
      if (subject === 'neet-inorganic-chemistry') return lesson.id >= 707 && lesson.id <= 715;
      if (subject === 'neet-organic-chemistry') return lesson.id >= 716 && lesson.id <= 724;
      if (subject === 'indian-history') return lesson.id >= 801 && lesson.id <= 810;
      if (subject === 'indian-geography') return lesson.id >= 811 && lesson.id <= 815;
      if (subject === 'indian-polity') return lesson.id >= 816 && lesson.id <= 820;
      if (subject === 'indian-economy') return lesson.id >= 821 && lesson.id <= 823;
      if (subject === 'environment') return lesson.id >= 824 && lesson.id <= 826;
      if (subject === 'general-science') return lesson.id >= 827 && lesson.id <= 828;
      if (subject === 'comprehension') return lesson.id >= 829 && lesson.id <= 830;
      if (subject === 'logical-reasoning') return lesson.id >= 831 && lesson.id <= 834;
      if (subject === 'quantitative-aptitude') return lesson.id >= 835 && lesson.id <= 837;
      if (subject === 'data-interpretation') return lesson.id >= 838 && lesson.id <= 839;
      if (subject === 'decision-making') return lesson.id === 840;
      if (subject === 'gs-paper-1') return lesson.id >= 841 && lesson.id <= 852;
      if (subject === 'gs-paper-2') return lesson.id >= 853 && lesson.id <= 863;
      if (subject === 'gs-paper-3') return lesson.id >= 864 && lesson.id <= 874;
      if (subject === 'gs-paper-4') return lesson.id >= 875 && lesson.id <= 885;
      if (subject === 'ethics-basics') return lesson.id >= 886 && lesson.id <= 889;
      if (subject === 'attitude-ei') return lesson.id >= 890 && lesson.id <= 893;
      if (subject === 'moral-thinkers') return lesson.id >= 894 && lesson.id <= 896;
      if (subject === 'probity') return lesson.id >= 897 && lesson.id <= 899;
      if (subject === 'case-studies') return lesson.id >= 900 && lesson.id <= 903;
      if (subject === 'essay-writing') return lesson.id >= 904 && lesson.id <= 910;
      if (subject === 'optional-subject') return lesson.id >= 911 && lesson.id <= 917;
      return false;
    });
  };

  useEffect(() => {
    if (fetchInProgress.current) return;
    
    const fetchData = async () => {
      if (!courseId || !lessonId) return;
      
      fetchInProgress.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const lessonData = await courseService.getLessonById(Number(lessonId));
        console.log(`✅ Lesson ${lessonId} fetched:`, lessonData);
        console.log(`🔍 Preview value:`, lessonData.isPreview);
        console.log(`🔍 Preview type:`, typeof lessonData.isPreview);
        
        if (!lessonData) {
          setError('Lesson not found');
          setIsLoading(false);
          fetchInProgress.current = false;
          return;
        }
        
        setCurrentLesson(lessonData);

        const courseData = await courseService.getCourseById(Number(courseId));
        console.log(`✅ Course ${courseId} fetched:`, courseData);
        
        // Force course price to ₹99
        const updatedCourse = {
          ...courseData,
          price: 99
        };
        setCourse(updatedCourse);

        const allLessons = await courseService.getCourseLessons(Number(courseId));
        console.log(`✅ All lessons for course ${courseId}:`, allLessons);
        
        // Filter lessons by subject
        let displayLessons = getFilteredLessons(allLessons, lessonData.id);
        
        setLessons(displayLessons);

        const index = displayLessons.findIndex(l => l.id === Number(lessonId));
        console.log(`✅ Current lesson index:`, index);
        setCurrentIndex(index);

        if (isAuthenticated) {
          try {
            const enrolled = await courseService.checkEnrollment(Number(courseId));
            setIsEnrolled(enrolled);

            if (enrolled) {
              const progress = await courseService.getCourseProgress(Number(courseId));
              setCompletedLessons(progress.completedLessons);
            }
          } catch (err) {
            console.error('Error checking enrollment:', err);
            setIsEnrolled(false);
          }
        } else {
          setIsEnrolled(false);
        }

        // Check for quiz if this is the last lesson
        if (index === displayLessons.length - 1) {
          checkForQuiz(lessonData.id);
        }

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load lesson');
      } finally {
        setIsLoading(false);
        fetchInProgress.current = false;
      }
    };

    fetchData();

    return () => {
      fetchInProgress.current = false;
    };
  }, [courseId, lessonId, isAuthenticated]);

  const checkForQuiz = async (lessonId: number) => {
    setCheckingQuiz(true);
    try {
      const quizzes = await quizService.getLessonQuizzes(lessonId);
      if (quizzes && quizzes.length > 0) {
        setHasQuiz(true);
        setQuizId(quizzes[0].id);
      } else {
        setHasQuiz(false);
      }
    } catch (err) {
      console.error('Error checking for quiz:', err);
      setHasQuiz(false);
    } finally {
      setCheckingQuiz(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!currentLesson || !isEnrolled) return;

    try {
      await courseService.markLessonCompleted(currentLesson.id);
      setCompletedLessons(prev => [...prev, currentLesson.id]);
      
      if (currentIndex === lessons.length - 1) {
        checkForQuiz(currentLesson.id);
      }
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevLesson = lessons[currentIndex - 1];
      navigate(`/courses/${courseId}/learn/${prevLesson.id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      navigate(`/courses/${courseId}/learn/${nextLesson.id}`);
    }
  };

  const handleLessonSelect = (lessonId: number) => {
    navigate(`/courses/${courseId}/learn/${lessonId}`);
  };

  const handleBack = () => {
    if (courseId === '4') {
      navigate('/courses/4', { replace: true });
    } else if (courseId === '9') {
      navigate('/courses/9/sections', { replace: true });
    } else if (courseId === '10' || courseId === '12') {
      navigate(`/courses/${courseId}/sections`, { replace: true });
    } else if (courseId === '13' && currentLesson) {
      const subject = getSubjectFromLessonId(currentLesson.id);
      if (subject.includes('indian') || subject === 'environment' || subject === 'general-science') {
        navigate('/courses/13/section/prelims-gs', { replace: true });
      } else if (subject.includes('comprehension') || subject.includes('logical') || subject.includes('quantitative') || subject.includes('data') || subject.includes('decision')) {
        navigate('/courses/13/section/csat', { replace: true });
      } else if (subject.includes('gs-paper')) {
        navigate('/courses/13/section/mains-gs', { replace: true });
      } else if (subject.includes('ethics') || subject.includes('attitude') || subject.includes('moral') || subject.includes('probity') || subject.includes('case')) {
        navigate('/courses/13/section/ethics', { replace: true });
      } else if (subject.includes('essay') || subject.includes('optional')) {
        navigate('/courses/13/section/essay-optional', { replace: true });
      } else {
        navigate('/courses/13/sections', { replace: true });
      }
    } else if (courseId === '18' || courseId === '19' || courseId === '20' || courseId === '21' || courseId === '22') {
      navigate(`/courses/${courseId}`, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const handleStartQuiz = () => {
    if (quizId) {
      navigate(`/courses/${courseId}/quiz/${quizId}`);
    }
  };

  const handleVideoEnd = () => {
    if (!isLessonCompleted(currentLesson?.id || 0)) {
      handleMarkComplete();
    }
  };

  const handleVideoProgress = (currentTime: number, duration: number) => {
    if (!isLessonCompleted(currentLesson?.id || 0) && currentTime / duration > 0.9) {
      handleMarkComplete();
    }
  };

  const progressPercentage = lessons.length > 0 && currentIndex >= 0
    ? Math.round(((currentIndex + 1) / lessons.length) * 100)
    : 0;

  const isLessonCompleted = (lessonId: number) => {
    return completedLessons.includes(lessonId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !course || !currentLesson || currentIndex === -1) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'Lesson not found'}</p>
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

  // Check if lesson is preview (handles all data types)
  const canViewLesson = isEnrolled || isPreviewLesson(currentLesson);
  const subjectInfo = getSubjectInfo(currentLesson.id);

  // Debug log
  console.log('🔐 Access Check:', {
    lessonId: currentLesson.id,
    isEnrolled,
    isPreview: currentLesson.isPreview,
    previewType: typeof currentLesson.isPreview,
    canView: canViewLesson
  });

  if (!canViewLesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Preview Lesson</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">This is a preview lesson. Enroll in the course to access all lessons.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={handleBack} 
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FaArrowLeft className="inline mr-2" /> Back
            </button>
            <button 
              onClick={() => navigate(`/courses/${courseId}`)} 
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <FaGraduationCap /> Enroll Now @ ₹99
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = isLessonCompleted(currentLesson.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={handleBack}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <FaBook className="text-blue-500" /> {lessons.length} Lessons
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <FaClock className="text-green-500" /> {currentLesson.durationMinutes} min
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Banner */}
            <div 
              className="p-4 rounded-lg border-l-4 flex items-start gap-4"
              style={{ backgroundColor: subjectInfo.color + '20', borderLeftColor: subjectInfo.color }}
            >
              <span className="text-3xl">{subjectInfo.icon}</span>
              <div>
                <span className="text-sm font-medium" style={{ color: subjectInfo.color }}>{subjectInfo.name}</span>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white mt-1">{currentLesson.title}</h1>
              </div>
            </div>

            {/* Video Player */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {currentLesson.videoUrl ? (
                <div className="aspect-video">
                  <YouTubePlayer
                    key={currentLesson.id}
                    videoUrl={currentLesson.videoUrl}
                    title={currentLesson.title}
                    onVideoEnd={handleVideoEnd}
                    onVideoPlay={() => console.log('Video started')}
                    onVideoPause={() => console.log('Video paused')}
                    onProgress={handleVideoProgress}
                    autoPlay={false}
                  />
                </div>
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <span className="text-6xl mb-4">📹</span>
                  <p className="text-gray-600 dark:text-gray-300">Video not available for this lesson</p>
                </div>
              )}

              {/* Lesson Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-700 dark:text-gray-200">
                      Lesson {currentIndex + 1} of {lessons.length}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <FaClock className="text-blue-500" /> {currentLesson.durationMinutes} min
                    </span>
                  </div>
                  
                  {isEnrolled && (
                    <button
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                        isCompleted 
                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 cursor-default'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      onClick={handleMarkComplete}
                      disabled={isCompleted}
                    >
                      <FaCheckCircle /> {isCompleted ? 'Completed' : 'Mark Complete'}
                    </button>
                  )}
                </div>
              </div>

              {/* Lesson Description */}
              {currentLesson.description && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">About this lesson</h3>
                  <p className="text-gray-600 dark:text-gray-300">{currentLesson.description}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              {isEnrolled && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between gap-4">
                  <button
                    className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      currentIndex === 0
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    <FaArrowLeft /> Previous
                  </button>
                  <button
                    className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      currentIndex === lessons.length - 1
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={handleNext}
                    disabled={currentIndex === lessons.length - 1}
                  >
                    Next <FaArrowLeft className="rotate-180" />
                  </button>
                </div>
              )}

              {/* Quiz Section */}
              {isEnrolled && lessons.length > 0 && currentIndex === lessons.length - 1 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">📝</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Ready to test your knowledge?</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Take a quiz to check what you've learned in this course.</p>
                        
                        {checkingQuiz ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600 dark:text-gray-300">Checking for quiz...</p>
                          </div>
                        ) : hasQuiz && quizId ? (
                          <button 
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
                            onClick={handleStartQuiz}
                          >
                            <FaPlayCircle /> Start Quiz
                          </button>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">No quiz available for this course yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {isEnrolled && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">📝</span>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Your Notes</h3>
                  </div>
                  <textarea
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take notes while watching the lesson..."
                    rows={4}
                  />
                  <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                    onClick={() => setSavingNotes(true)}
                    disabled={savingNotes}
                  >
                    <span>💾</span>
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Course Content Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{course.title}</h3>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Course Progress</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%`, backgroundColor: subjectInfo.color }}
                  ></div>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <FaBook className="text-blue-500 text-xl" />
                  <div>
                    <span className="text-lg font-bold text-gray-800 dark:text-white block">{course.totalLessons || lessons.length}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Lessons</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-green-500 text-xl" />
                  <div>
                    <span className="text-lg font-bold text-gray-800 dark:text-white block">{course.durationHours || 0}h</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Duration</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaUsers className="text-orange-500 text-xl" />
                  <div>
                    <span className="text-lg font-bold text-gray-800 dark:text-white block">{course.totalStudents || 0}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Students</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaStar className="text-yellow-500 text-xl" />
                  <div>
                    <span className="text-lg font-bold text-gray-800 dark:text-white block">{course.rating?.toFixed(1) || '4.5'}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Rating</span>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300 block">Course Price</span>
                <span className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-1">
                  <FaRupeeSign className="text-xl" /> 99/-
                </span>
              </div>
            </div>

            {/* Lessons List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaBook className="text-blue-600" />
                <h3 className="font-semibold text-gray-800 dark:text-white">Course Content</h3>
              </div>
              
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {lessons.length > 0 ? (
                  lessons.map((lesson, index) => {
                    const isActive = lesson.id === currentLesson?.id;
                    const isComplete = completedLessons.includes(lesson.id);
                    const isLocked = !isEnrolled && !isPreviewLesson(lesson);

                    return (
                      <div
                        key={lesson.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4' 
                            : isComplete 
                            ? 'bg-green-50 dark:bg-green-900/20' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        style={isActive ? { borderLeftColor: subjectInfo.color } : {}}
                        onClick={() => !isLocked && handleLessonSelect(lesson.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {isComplete ? (
                              <FaCheckCircle className="text-green-500" />
                            ) : isActive ? (
                              <FaPlayCircle style={{ color: subjectInfo.color }} />
                            ) : (
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{index + 1}</span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>
                              {lesson.title}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <FaClock /> {lesson.durationMinutes} min
                              </span>
                              {isPreviewLesson(lesson) && !isEnrolled && (
                                <span 
                                  className="px-2 py-0.5 text-white text-xs rounded-full"
                                  style={{ backgroundColor: subjectInfo.color }}
                                >
                                  PREVIEW
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {isLocked && <FaLock className="text-gray-400 flex-shrink-0 mt-1" />}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No lessons available
                  </div>
                )}
              </div>

              {/* Course Completion Badge */}
              {progressPercentage === 100 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg text-center font-semibold flex items-center justify-center gap-2">
                  <FaTrophy /> Course Completed! 🎉
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailsPage;