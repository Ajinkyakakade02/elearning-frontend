// src/services/question.service.ts
import axiosInstance from './axios.config';
import { API_ENDPOINTS } from './api.config';

export interface Question {
  id: number;
  questionId: string;
  title: string;
  platform: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
  topic: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionsResponse {
  data: Question[];
  total?: number;
}

export const questionService = {
  /**
   * Get all questions
   */
  async getAllQuestions(): Promise<Question[]> {
    try {
      const response = await axiosInstance.get('/questions');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all questions:', error);
      throw error;
    }
  },

  /**
   * Get question by ID
   */
  async getQuestionById(id: number): Promise<Question> {
    try {
      const response = await axiosInstance.get(`/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch question ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get questions by topic
   */
  async getQuestionsByTopic(topic: string): Promise<Question[]> {
    try {
      console.log(`📡 Fetching questions for topic: ${topic}`);
      const response = await axiosInstance.get(`/questions/topic/${topic}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch questions for topic ${topic}:`, error);
      throw error;
    }
  },

  /**
   * Get questions by platform
   */
  async getQuestionsByPlatform(platform: string): Promise<Question[]> {
    try {
      const response = await axiosInstance.get(`/questions/platform/${platform}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch questions for platform ${platform}:`, error);
      throw error;
    }
  },

  /**
   * Get questions by difficulty
   */
  async getQuestionsByDifficulty(difficulty: string): Promise<Question[]> {
    try {
      const response = await axiosInstance.get(`/questions/difficulty/${difficulty}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch questions for difficulty ${difficulty}:`, error);
      throw error;
    }
  },

  /**
   * Get questions by topic and platform
   */
  async getQuestionsByTopicAndPlatform(topic: string, platform: string): Promise<Question[]> {
    try {
      const response = await axiosInstance.get(`/questions/topic/${topic}/platform/${platform}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch questions for topic ${topic} and platform ${platform}:`, error);
      throw error;
    }
  },

  /**
   * Get questions by topic and difficulty
   */
  async getQuestionsByTopicAndDifficulty(topic: string, difficulty: string): Promise<Question[]> {
    try {
      const response = await axiosInstance.get(`/questions/topic/${topic}/difficulty/${difficulty}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch questions for topic ${topic} and difficulty ${difficulty}:`, error);
      throw error;
    }
  },

  /**
   * Get questions with multiple filters
   */
  async getQuestionsWithFilters(
    topic?: string,
    platform?: string,
    difficulty?: string
  ): Promise<Question[]> {
    try {
      const params = new URLSearchParams();
      if (topic) params.append('topic', topic);
      if (platform) params.append('platform', platform);
      if (difficulty) params.append('difficulty', difficulty);
      
      const response = await axiosInstance.get(`/questions/filter?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch filtered questions:', error);
      throw error;
    }
  },

  /**
   * Search questions by title
   */
  async searchQuestions(searchTerm: string): Promise<Question[]> {
    try {
      const response = await axiosInstance.get(`/questions/search?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to search questions with term "${searchTerm}":`, error);
      throw error;
    }
  },

  /**
   * Get all distinct topics
   */
  async getAllTopics(): Promise<string[]> {
    try {
      const response = await axiosInstance.get('/questions/topics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch topics:', error);
      throw error;
    }
  },

  /**
   * Get all distinct platforms
   */
  async getAllPlatforms(): Promise<string[]> {
    try {
      const response = await axiosInstance.get('/questions/platforms');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch platforms:', error);
      throw error;
    }
  },

  /**
   * Get question statistics
   */
  async getStatistics(): Promise<any> {
    try {
      const response = await axiosInstance.get('/questions/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      throw error;
    }
  },

  /**
   * Helper function to get difficulty color
   */
  getDifficultyColor(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  },

  /**
   * Helper function to get platform icon
   */
  getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
      leetcode: '💻',
      geeksforgeeks: '📘',
      codechef: '🍴',
      hackerrank: '⚡',
      default: '📚'
    };
    return icons[platform.toLowerCase()] || icons.default;
  }
};

export default questionService;