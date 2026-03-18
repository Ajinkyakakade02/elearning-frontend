// ============================================
// ENROLLMENT HOOK - Manage enrollment state
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { enrollmentService, EnrollmentWithCourse } from '../services/enrollment.service';
import { Enrollment } from '../types/course.types';

export const useEnrollment = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all user enrollments
  const fetchEnrollments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await enrollmentService.getUserEnrollments();
      setEnrollments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch enrollments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enroll in a course
  const enrollInCourse = async (courseId: number): Promise<Enrollment> => {
    setIsLoading(true);
    setError(null);
    try {
      const enrollment = await enrollmentService.enrollInCourse(courseId);
      await fetchEnrollments(); // Refresh the list
      return enrollment;
    } catch (err: any) {
      setError(err.message || 'Failed to enroll');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if enrolled in a specific course
  const checkEnrollment = useCallback(async (courseId: number): Promise<boolean> => {
    try {
      return await enrollmentService.isEnrolled(courseId);
    } catch (err) {
      return false;
    }
  }, []);

  // Get enrollment for a specific course
  const getEnrollmentForCourse = useCallback((courseId: number): EnrollmentWithCourse | undefined => {
    return enrollments.find(e => e.courseId === courseId);
  }, [enrollments]);

  // Calculate total progress
  const getOverallProgress = useCallback((): number => {
    if (enrollments.length === 0) return 0;
    const total = enrollments.reduce((acc, e) => acc + (e.progress || 0), 0);
    return Math.round(total / enrollments.length);
  }, [enrollments]);

  // Get completed courses count
  const getCompletedCount = useCallback((): number => {
    return enrollments.filter(e => e.progress === 100).length;
  }, [enrollments]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return {
    enrollments,
    isLoading,
    error,
    fetchEnrollments,
    enrollInCourse,
    checkEnrollment,
    getEnrollmentForCourse,
    getOverallProgress,
    getCompletedCount
  };
};