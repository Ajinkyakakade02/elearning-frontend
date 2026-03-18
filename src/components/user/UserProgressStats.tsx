import React, { useState, useEffect } from 'react';
import { 
  FaTrophy, 
  FaChartLine, 
  FaClock, 
  FaCheckCircle,
  FaBookOpen,
  FaRupeeSign
} from 'react-icons/fa';
import progressService, { UserProgress } from '../../services/progress.service';
import { paymentService } from '../../services/payment.service';

interface UserProgressStatsProps {
  userId?: number;
}

const UserProgressStats: React.FC<UserProgressStatsProps> = ({ userId }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [purchasedCount, setPurchasedCount] = useState(0);

  useEffect(() => {
    fetchProgress();
    fetchPurchaseData();
  }, [userId]);

  const fetchProgress = async () => {
    setIsLoading(true);
    try {
      // Try API first
      const data = await progressService.getUserProgress();
      const streakData = await progressService.getUserStreak();
      
      if (data) {
        setProgress(data);
      } else {
        // Use mock data for development
        setProgress(progressService.getMockUserProgress());
      }
      setStreak(streakData || 5);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      // Fallback to mock data
      setProgress(progressService.getMockUserProgress());
      setStreak(5);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPurchaseData = async () => {
    try {
      const purchases = await paymentService.getUserPurchases();
      setPurchasedCount(purchases.length);
      setTotalSpent(purchases.length * 99);
    } catch (error) {
      console.error('Failed to fetch purchase data:', error);
      // Fallback to mock data
      setPurchasedCount(3);
      setTotalSpent(3 * 99);
    }
  };

  // Stat card colors mapping
  const statCardColors = {
    primary: 'bg-gradient-to-br from-blue-500 to-purple-600',
    success: 'bg-gradient-to-br from-green-500 to-emerald-600',
    warning: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    danger: 'bg-gradient-to-br from-red-500 to-pink-600'
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading your progress...</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
        <FaBookOpen className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No progress yet</h3>
        <p className="text-gray-600 dark:text-gray-300">Take your first quiz to start tracking!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <FaChartLine className="text-blue-600 dark:text-blue-400" /> Your Learning Progress
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Quizzes Passed */}
        <div className={`${statCardColors.primary} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <FaTrophy className="text-2xl" />
            </div>
            <div>
              <div className="text-2xl font-bold">{progress.quizzesPassed}</div>
              <div className="text-sm text-white/80">Quizzes Passed</div>
            </div>
          </div>
        </div>

        {/* Correct Answers */}
        <div className={`${statCardColors.success} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <FaCheckCircle className="text-2xl" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {progress.correctAnswers}/{progress.totalQuestionsAnswered}
              </div>
              <div className="text-sm text-white/80">Correct Answers</div>
            </div>
          </div>
        </div>

        {/* Average Score */}
        <div className={`${statCardColors.warning} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <FaChartLine className="text-2xl" />
            </div>
            <div>
              <div className="text-2xl font-bold">{progress.averageScore}%</div>
              <div className="text-sm text-white/80">Average Score</div>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className={`${statCardColors.danger} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <div className="text-2xl font-bold">{streak}</div>
              <div className="text-sm text-white/80">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300">Courses Purchased:</span>
            <span className="text-xl font-bold text-gray-800 dark:text-white">{purchasedCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300">Total Investment:</span>
            <span className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
              <FaRupeeSign /> {totalSpent}/-
            </span>
          </div>
        </div>
      </div>

      {/* Detail Row */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center gap-2">
          <FaClock className="text-blue-500" />
          <span>Total Time: {Math.round(progress.totalTimeSpent / 60)} minutes</span>
        </div>
        <div className="flex items-center gap-2">
          <FaBookOpen className="text-purple-500" />
          <span>Quizzes Taken: {progress.totalQuizzesTaken}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProgressStats;