import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaBook, FaPlayCircle, FaLock, FaUsers, FaRupeeSign } from 'react-icons/fa';
import courseService from '../../services/course.service';
import { Lesson } from '../../types/course.types';

interface BaseSubjectLessonsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  courseId: number;
  subjectTitle: string;
  subjectIcon: React.ReactNode;
  subjectColor: string;
  lessonIdRange: number[];
  price?: number;
}

const BaseSubjectLessonsPage: React.FC<BaseSubjectLessonsPageProps> = ({
  darkMode,
  setDarkMode,
  courseId,
  subjectTitle,
  subjectIcon,
  subjectColor,
  lessonIdRange,
  price = 99
}) => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchLessons();
    checkEnrollment();
  }, []);

  const checkEnrollment = async () => {
    try {
      const enrolled = await courseService.checkEnrollment(courseId);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Failed to check enrollment:', error);
      setIsEnrolled(false);
    }
  };

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const allLessons = await courseService.getCourseLessons(courseId);
      const filteredLessons = allLessons.filter((lesson: Lesson) => 
        lessonIdRange.includes(lesson.id)
      );
      filteredLessons.sort((a: Lesson, b: Lesson) => a.id - b.id);
      setLessons(filteredLessons);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLesson = (lessonId: number) => {
    navigate(`/courses/${courseId}/learn/${lessonId}`);
  };

  const handleEnroll = () => {
    navigate(`/courses/${courseId}`);
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
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
        </div>

        {/* Subject Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl" style={{ color: subjectColor }}>{subjectIcon}</span>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{subjectTitle}</h1>
          </div>
          
          {!isEnrolled && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold">
              <FaRupeeSign /> {price}/- Complete Section
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl"
              style={{ background: subjectColor }}
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
              style={{ background: subjectColor }}
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
        </div>

        {/* Enroll Button */}
        {!isEnrolled && (
          <div className="text-center mb-8">
            <button 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              onClick={handleEnroll}
            >
              Enroll Now @ ₹{price}
            </button>
          </div>
        )}

        {/* Lessons List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {lessons.length} lessons in this section
          </div>
          
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">No lessons available yet.</p>
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
                      <div className="text-xl" style={{ color: isLocked ? undefined : subjectColor }}>
                        {isLocked ? <FaLock /> : <FaPlayCircle />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          Lesson {index + 1}: {lesson.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <FaClock /> {lesson.durationMinutes || 45} min
                        </span>
                        {lesson.isPreview && (
                          <span 
                            className="px-2 py-1 text-white text-xs font-semibold rounded-full"
                            style={{ background: subjectColor }}
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

export default BaseSubjectLessonsPage;