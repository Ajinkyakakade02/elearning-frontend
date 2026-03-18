// ============================================
// ENROLLMENT SERVICE - Handle course enrollments
// ============================================

import axiosInstance from './axios.config';
import { API_ENDPOINTS } from './api.config';
import { Enrollment, Course } from '../types/course.types';

export interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

export const enrollmentService = {
  /**
   * Enroll in a course
   */
  async enrollInCourse(courseId: number): Promise<Enrollment> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ENROLLMENTS.ENROLL, {
        courseId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to enroll in course');
    }
  },

  /**
   * Get all enrollments for current user
   */
  async getUserEnrollments(): Promise<EnrollmentWithCourse[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ENROLLMENTS.MY_COURSES);
      
      // Fetch course details for each enrollment
      const enrollmentsWithCourses = await Promise.all(
        response.data.map(async (enrollment: any) => {
          try {
            const courseResponse = await axiosInstance.get(
              API_ENDPOINTS.COURSES.GET_BY_ID(enrollment.courseId)
            );
            return {
              ...enrollment,
              course: courseResponse.data
            };
          } catch (err) {
            return enrollment;
          }
        })
      );
      
      return enrollmentsWithCourses;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch enrollments');
    }
  },

  /**
   * Get enrollment for a specific course
   */
  async getEnrollment(courseId: number): Promise<Enrollment | null> {
    try {
      const response = await axiosInstance.get(`/api/enrollments/course/${courseId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Not enrolled
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch enrollment');
    }
  },

  /**
   * Update progress for a course
   */
  async updateProgress(courseId: number, progress: number, lessonId?: string): Promise<Enrollment> {
    try {
      const url = lessonId 
        ? `${API_ENDPOINTS.ENROLLMENTS.PROGRESS(courseId)}?progress=${progress}&lessonId=${lessonId}`
        : `${API_ENDPOINTS.ENROLLMENTS.PROGRESS(courseId)}?progress=${progress}`;
      
      const response = await axiosInstance.put(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update progress');
    }
  },

  /**
   * Check if user is enrolled in a course
   */
  async isEnrolled(courseId: number): Promise<boolean> {
    const enrollment = await this.getEnrollment(courseId);
    return enrollment !== null;
  }
};