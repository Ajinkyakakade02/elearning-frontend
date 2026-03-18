// ============================================
// useCourses Hook - Course data management
// ============================================

import { useState, useEffect } from 'react';
import { Course } from '../types/course.types';
import courseService from '../services/course.service';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  const searchCourses = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseService.searchCourses(query);
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseById = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      return await courseService.getCourseById(id);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch course');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    isLoading,
    error,
    fetchCourses,
    searchCourses,
    getCourseById,
  };
};