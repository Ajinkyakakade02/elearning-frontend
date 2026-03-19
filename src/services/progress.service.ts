import axiosInstance from './axios.config';
import { tokenManager } from '../utils/tokenManager';

export interface QuizAttempt {
  id: number;
  userId: number;
  quizId: number;
  quizTitle: string;
  topicId?: string;
  topicTitle?: string;
  score: number;
  totalPoints: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  passed: boolean;
  attemptedAt: string;
}

export interface UserProgress {
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  averageScore: number;
  quizzesPassed: number;
  totalTimeSpent: number;
  streakDays: number;
  lastActive: string;
}

export interface TopicProgress {
  topicId: string;
  topicTitle: string;
  quizId: number;
  attempts: number;
  bestScore: number;
  lastAttemptDate: string;
  passed: boolean;
}

const progressService = {
  /**
   * Save quiz attempt to database
   */
  async saveQuizAttempt(attemptData: Omit<QuizAttempt, 'id' | 'attemptedAt'>): Promise<QuizAttempt | null> {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        console.log('User not logged in, progress not saved');
        return null;
      }

      const response = await axiosInstance.post('/api/user/progress/quiz-attempt', {
        ...attemptData,
        attemptedAt: new Date().toISOString()
      });

      console.log('✅ Quiz attempt saved:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to save quiz attempt:', error);
      return null;
    }
  },

  /**
   * Get user's quiz history
   */
  async getQuizHistory(): Promise<QuizAttempt[]> {
    try {
      const token = tokenManager.getToken();
      if (!token) return [];

      const response = await axiosInstance.get('/api/user/progress/quiz-history');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch quiz history:', error);
      return [];
    }
  },

  /**
   * Get user's overall progress summary
   */
  async getUserProgress(): Promise<UserProgress | null> {
    try {
      const token = tokenManager.getToken();
      if (!token) return null;

      const response = await axiosInstance.get('/api/user/progress/summary');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch user progress:', error);
      return null;
    }
  },

  /**
   * Get progress for specific quiz
   */
  async getQuizProgress(quizId: number): Promise<QuizAttempt[]> {
    try {
      const token = tokenManager.getToken();
      if (!token) return [];

      const response = await axiosInstance.get(`/api/user/progress/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch quiz progress:', error);
      return [];
    }
  },

  /**
   * Get progress for specific topic
   */
  async getTopicProgress(topicId: string): Promise<TopicProgress | null> {
    try {
      const token = tokenManager.getToken();
      if (!token) return null;

      const response = await axiosInstance.get(`/api/user/progress/topic/${topicId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch topic progress:', error);
      return null;
    }
  },

  /**
   * Get user's streak
   */
  async getUserStreak(): Promise<number> {
    try {
      const token = tokenManager.getToken();
      if (!token) return 0;

      const response = await axiosInstance.get('/api/user/progress/streak');
      return response.data.streak || 0;
    } catch (error) {
      console.error('❌ Failed to fetch streak:', error);
      return 0;
    }
  },

  /**
   * Mock data for development (when API is not ready)
   */
  getMockQuizHistory(): QuizAttempt[] {
    return [
      {
        id: 1,
        userId: 1,
        quizId: 1,
        quizTitle: 'DSA - Sliding Window',
        topicId: 'sliding-window',
        topicTitle: 'Sliding Window',
        score: 40,
        totalPoints: 50,
        percentage: 80,
        correctAnswers: 4,
        totalQuestions: 5,
        timeSpentSeconds: 320,
        passed: true,
        attemptedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        userId: 1,
        quizId: 2,
        quizTitle: 'JEE - Physics',
        topicId: 'jee-physics',
        topicTitle: 'Physics',
        score: 30,
        totalPoints: 50,
        percentage: 60,
        correctAnswers: 3,
        totalQuestions: 5,
        timeSpentSeconds: 280,
        passed: false,
        attemptedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        userId: 1,
        quizId: 3,
        quizTitle: 'NEET - Biology',
        topicId: 'neet-biology',
        topicTitle: 'Biology',
        score: 50,
        totalPoints: 50,
        percentage: 100,
        correctAnswers: 5,
        totalQuestions: 5,
        timeSpentSeconds: 240,
        passed: true,
        attemptedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  },

  /**
   * Get mock user progress
   */
  getMockUserProgress(): UserProgress {
    const history = this.getMockQuizHistory();
    const totalQuizzes = history.length;
    const totalCorrect = history.reduce((sum, a) => sum + a.correctAnswers, 0);
    const totalQuestions = history.reduce((sum, a) => sum + a.totalQuestions, 0);
    const totalScore = history.reduce((sum, a) => sum + a.score, 0);
    const totalPossible = history.reduce((sum, a) => sum + a.totalPoints, 0);
    const passedCount = history.filter(a => a.passed).length;

    return {
      totalQuizzesTaken: totalQuizzes,
      totalQuestionsAnswered: totalQuestions,
      correctAnswers: totalCorrect,
      averageScore: totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0,
      quizzesPassed: passedCount,
      totalTimeSpent: history.reduce((sum, a) => sum + a.timeSpentSeconds, 0),
      streakDays: 5,
      lastActive: new Date().toISOString()
    };
  }
};

export default progressService;