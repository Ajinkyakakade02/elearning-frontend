import { useState, useEffect } from 'react';
import courseService from '../services/course.service';
import { Course } from '../types/course.types';

export interface DashboardStats {
  totalUsers?: number;
  totalStudents: number;
  totalCourses: number;
  publishedCourses: number;
  averageRating: number;
  enrolledCourses?: number;
  completedCourses?: number;
  totalProgress?: number;
  streak?: number;
}

export interface RecentActivity {
  id: number;
  type: 'enrollment' | 'completion' | 'quiz' | 'course';
  title: string;
  timestamp: string;
  details?: string;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch courses from your existing service
        const courses = await courseService.getAllCourses();
        
        // Mock stats for now (your DashboardPage already uses similar stats)
        setStats({
          totalStudents: 50000,
          totalCourses: courses.length,
          publishedCourses: courses.filter(c => c.isPublished).length,
          averageRating: 4.5,
          enrolledCourses: 12,
          completedCourses: 8,
          totalProgress: 65,
          streak: 5
        });

        // Mock recent activity
        setRecentActivity([
          {
            id: 1,
            type: 'enrollment',
            title: 'Enrolled in JEE Mathematics',
            timestamp: new Date().toISOString(),
            details: 'Started new course'
          },
          {
            id: 2,
            type: 'quiz',
            title: 'Completed DSA Quiz',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            details: 'Scored 85%'
          },
          {
            id: 3,
            type: 'completion',
            title: 'Completed Arrays Course',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            details: 'Certificate earned'
          }
        ]);

        setPopularCourses(courses.slice(0, 5));
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard data');
        
        // Set fallback data
        setStats({
          totalStudents: 50000,
          totalCourses: 25,
          publishedCourses: 22,
          averageRating: 4.5,
          enrolledCourses: 0,
          completedCourses: 0,
          totalProgress: 0,
          streak: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    stats,
    recentActivity,
    popularCourses,
    isLoading,
    error
  };
};