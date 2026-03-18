// ============================================
// QUIZ HOOK - Manage quizzes
// ============================================

import { useState, useEffect } from 'react';
import axiosInstance from '../services/axios.config';  // Fixed path
import { API_ENDPOINTS } from '../services/api.config';  // Fixed path

export interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  questions?: Question[];
  lessonId?: number;
}

export interface Question {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  points: number;
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  score: number;
  isPassed: boolean;
  startedAt: string;
  completedAt?: string;
}

export const useQuiz = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Since backend doesn't have a direct "get all quizzes" endpoint,
      // we'll get them from courses
      const coursesResponse = await axiosInstance.get(API_ENDPOINTS.COURSES.ALL);
      const allQuizzes: Quiz[] = [];
      
      for (const course of coursesResponse.data) {
        try {
          const courseQuizzes = await axiosInstance.get(
            API_ENDPOINTS.QUIZZES.BY_COURSE(course.id)
          );
          allQuizzes.push(...courseQuizzes.data);
        } catch (err) {
          // Course might not have quizzes
        }
      }
      
      setQuizzes(allQuizzes);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const getQuizById = async (id: number): Promise<Quiz> => {
    const response = await axiosInstance.get(API_ENDPOINTS.QUIZZES.GET_BY_ID(id));
    return response.data;
  };

  const startQuiz = async (quizId: number): Promise<QuizAttempt> => {
    const response = await axiosInstance.post(API_ENDPOINTS.QUIZZES.START(quizId));
    return response.data;
  };

  const submitQuiz = async (attemptId: number, answers: Record<number, string>): Promise<QuizAttempt> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.QUIZZES.SUBMIT(attemptId),
      answers
    );
    return response.data;
  };

  return {
    quizzes,
    isLoading,
    error,
    getQuizById,
    startQuiz,
    submitQuiz,
    refetch: fetchQuizzes
  };
};