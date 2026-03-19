import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHistory, 
  FaCheckCircle, 
  FaClock,
  FaPlayCircle,
  // FaRupeeSign  // Remove this if not used elsewhere
} from 'react-icons/fa';
import progressService, { QuizAttempt } from '../../services/progress.service';
// REMOVE: import { paymentService } from '../../services/payment.service';

interface QuizHistoryProps {
  limit?: number;
  showViewAll?: boolean;
}

const QuizHistory: React.FC<QuizHistoryProps> = ({ limit = 5, showViewAll = true }) => {
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // REMOVE: const [totalSpent, setTotalSpent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
    // REMOVE: fetchPurchaseData();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await progressService.getQuizHistory();
      if (data && data.length > 0) {
        setHistory(data);
      } else {
        // Use mock data for development
        setHistory(progressService.getMockQuizHistory());
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setHistory(progressService.getMockQuizHistory());
    } finally {
      setIsLoading(false);
    }
  };

  // REMOVE this entire function:
  // const fetchPurchaseData = async () => { ... }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetake = (quizId: number, topicId?: string) => {
    if (topicId) {
      navigate(`/quiz/${quizId}/topic/${topicId}`);
    } else {
      navigate(`/quiz/${quizId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading history...</p>
      </div>
    );
  }

  const displayedHistory = limit ? history.slice(0, limit) : history;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaHistory className="text-blue-600 dark:text-blue-400" /> Recent Quiz Attempts
            </h2>
            {/* REMOVE the totalSpent badge */}
          </div>
          {showViewAll && history.length > limit && (
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
              onClick={() => navigate('/progress')}
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* History List - rest remains the same */}
      {displayedHistory.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No quiz attempts yet. Start practicing!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {displayedHistory.map((attempt) => (
            <div key={attempt.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              {/* Item Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                    {attempt.quizTitle}
                  </h3>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                    {attempt.topicTitle}
                  </span>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-sm font-semibold
                  ${attempt.passed 
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                  }
                `}>
                  {attempt.percentage}%
                </div>
              </div>

              {/* Item Details */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <FaCheckCircle className={attempt.passed ? 'text-green-500' : 'text-red-500'} />
                  <span>{attempt.correctAnswers}/{attempt.totalQuestions} correct</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <FaClock className="text-blue-500" />
                  <span>{formatTime(attempt.timeSpentSeconds)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {formatDate(attempt.attemptedAt)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all text-sm font-medium group"
                  onClick={() => handleRetake(attempt.quizId, attempt.topicId)}
                >
                  <FaPlayCircle className="group-hover:scale-110 transition-transform" /> Retake Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizHistory;