import axiosInstance from './axios.config';

export interface VideoLecture {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  videoUrl: string;
  thumbnail?: string;
  instructor?: string;
  students?: number;
  rating?: number;
  price: number;
}

export const videoService = {
  /**
   * Get video lecture by topic ID
   */
  async getVideoLecture(topicId: string): Promise<VideoLecture | null> {
    try {
      const response = await axiosInstance.get(`/api/videos/topic/${topicId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch video for topic ${topicId}:`, error);
      return null;
    }
  },

  /**
   * Get all video lectures
   */
  async getAllVideoLectures(): Promise<VideoLecture[]> {
    try {
      const response = await axiosInstance.get('/api/videos');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      throw error;
    }
  }
};