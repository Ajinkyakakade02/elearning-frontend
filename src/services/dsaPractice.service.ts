import axiosInstance from './axios.config';

export interface DSAProblem {
  id: number;
  problem_id: string;
  title: string;
  platform: 'leetcode' | 'geeksforgeeks' | 'codechef' | 'hackerrank';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
  topic: string;
  subtopic?: string;
  is_premium?: boolean;
  companies?: string;
  created_at?: string;
  updated_at?: string;
}

// Topic mapping function
const mapTopicToDb = (topic: string): string => {
  const topicMap: Record<string, string> = {
    'arrays': 'array-string',
    'linkedlist': 'linkedlist',
    'stack-queue': 'stack-queue',
    'trees-graphs': 'trees-graphs',
    'dp': 'dp',
    'searching-sorting': 'searching-sorting',
    'sliding-window': 'sliding-window'
  };
  return topicMap[topic] || topic;
};

export const dsaPracticeService = {
  /**
   * Get all problems by topic - using existing question endpoints
   */
  async getProblemsByTopic(topic: string): Promise<DSAProblem[]> {
    try {
      console.log(`📡 Fetching problems for topic: ${topic} from questions API`);
      
      // Map frontend topic to database topic
      const dbTopic = mapTopicToDb(topic);
      console.log(`📋 Mapped to database topic: ${dbTopic}`);
      
      // Use existing question service endpoint
      const response = await axiosInstance.get(`/questions/topic/${dbTopic}`);
      
      console.log(`✅ Received ${response.data.length} problems`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch problems for topic ${topic}:`, error);
      throw error;
    }
  },

  /**
   * Get problems by topic and platform
   */
  async getProblemsByTopicAndPlatform(topic: string, platform: string): Promise<DSAProblem[]> {
    try {
      const dbTopic = mapTopicToDb(topic);
      const response = await axiosInstance.get(`/questions/topic/${dbTopic}/platform/${platform}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch problems for topic ${topic} and platform ${platform}:`, error);
      throw error;
    }
  },

  /**
   * Get problems by topic and difficulty
   */
  async getProblemsByTopicAndDifficulty(topic: string, difficulty: string): Promise<DSAProblem[]> {
    try {
      const dbTopic = mapTopicToDb(topic);
      const response = await axiosInstance.get(`/questions/topic/${dbTopic}/difficulty/${difficulty}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch problems for topic ${topic} and difficulty ${difficulty}:`, error);
      throw error;
    }
  },

  /**
   * Search problems by title
   */
  async searchProblems(query: string): Promise<DSAProblem[]> {
    try {
      const response = await axiosInstance.get(`/questions/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search problems:', error);
      throw error;
    }
  }
};