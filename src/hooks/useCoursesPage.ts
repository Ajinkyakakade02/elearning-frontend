import { useState, useEffect, useCallback } from 'react';
import courseService from '../services/course.service';
import { Course } from '../types/course.types';

export const useCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load all courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Search whenever searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      searchCourses(searchTerm);
    }
  }, [searchTerm]);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
      setFilteredCourses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  const searchCourses = async (term: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await courseService.searchCourses(term);
      setFilteredCourses(results);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter by category
  const filterByCategory = useCallback(() => {
    if (filter === 'all') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => 
        course.categoryName?.toLowerCase() === filter.toLowerCase()
      );
      setFilteredCourses(filtered);
    }
  }, [courses, filter]);

  // Update when filter changes (but not when searching)
  useEffect(() => {
    if (!searchTerm) {
      filterByCategory();
    }
  }, [filter, searchTerm, filterByCategory]); // ✅ Added filterByCategory to fix warning

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setSearchTerm('');
  };

  return {
    courses: filteredCourses,
    allCourses: courses,
    isLoading,
    error,
    filter,
    searchTerm,
    handleSearch,
    handleFilterChange,
    refetch: fetchCourses
  };
};