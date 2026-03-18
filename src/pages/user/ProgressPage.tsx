import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartLine, FaRupeeSign } from 'react-icons/fa';
import UserProgressStats from '../../components/user/UserProgressStats';
import QuizHistory from '../../components/user/QuizHistory';
import { useAuth } from '../../hooks/useAuth';
import { paymentService } from '../../services/payment.service';

interface ProgressPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const ProgressPage: React.FC<ProgressPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('all');
  const [totalSpent, setTotalSpent] = useState(0);
  const [purchasedCount, setPurchasedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's purchase summary
    const fetchPurchaseSummary = async () => {
      setLoading(true);
      if (user) {
        try {
          // Try to get real data from API
          const summary = await paymentService.getPurchaseSummary();
          setTotalSpent(summary.totalSpent);
          setPurchasedCount(summary.courseCount + summary.quizCount);
        } catch (error) {
          console.error('Failed to fetch purchases:', error);
          // Fallback to mock data for development
          setTotalSpent(3 * 99); // Assume 3 courses purchased
          setPurchasedCount(3);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchPurchaseSummary();
  }, [user]);

  const handleBackToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleTimeframeChange = useCallback((newTimeframe: 'week' | 'month' | 'all') => {
    setTimeframe(newTimeframe);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header with back button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={handleBackToDashboard}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
            <FaChartLine className="text-blue-600" /> My Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Track your learning journey and quiz performance</p>
        </div>

        {/* Purchase Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Courses Purchased</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {loading ? '...' : purchasedCount}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Investment</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center">
                <FaRupeeSign className="text-xl" /> {loading ? '...' : totalSpent}/-
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Avg. per Course</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FaRupeeSign className="text-xl" /> 99/-
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                timeframe === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleTimeframeChange('week')}
            >
              This Week
            </button>
            <button 
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                timeframe === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleTimeframeChange('month')}
            >
              This Month
            </button>
            <button 
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                timeframe === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleTimeframeChange('all')}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="mb-8">
          <UserProgressStats />
        </div>

        {/* Quiz History */}
        <div className="mb-8">
          <QuizHistory limit={10} showViewAll={false} />
        </div>

        {/* Achievement Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 text-center opacity-50">
              <span className="text-4xl block mb-2">🏆</span>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">First Quiz</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">Complete your first quiz</p>
              <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-xs">
                1/1 Completed
              </span>
            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white rounded-xl p-6 text-center">
              <span className="text-4xl block mb-2">🔥</span>
              <h3 className="font-semibold mb-1">5 Day Streak</h3>
              <p className="text-xs text-white/80 mb-3">Take quizzes for 5 days in a row</p>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs">
                5/5 Days
              </span>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 text-center opacity-50">
              <span className="text-4xl block mb-2">⭐</span>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Perfect Score</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">Get 100% on any quiz</p>
              <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-xs">
                0/1 Completed
              </span>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6 text-center">
              <span className="text-4xl block mb-2">📚</span>
              <h3 className="font-semibold mb-1">Quiz Master</h3>
              <p className="text-xs text-white/80 mb-3">Complete 10 quizzes</p>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs">
                3/10 Completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;