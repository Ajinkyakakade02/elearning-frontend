import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quiz.service';
import { UserProgress } from '../../types/quiz.types';
import { FaChartLine, FaCheckCircle, FaClock, FaTrophy } from 'react-icons/fa';

interface UserQuizProgressProps {
  userId: number;
}

const UserQuizProgress: React.FC<UserQuizProgressProps> = ({ userId }) => {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgress();
  }, [userId]);

  const fetchProgress = async () => {
    setIsLoading(true);
    try {
      const data = await quizService.getUserQuizProgress();
      setProgress(data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading progress...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <FaChartLine className="text-blue-600 dark:text-blue-400" /> Your Quiz Progress
      </h2>
      
      {/* Progress List */}
      {progress.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No quiz attempts yet. Start practicing!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {progress.map((item) => (
            <div 
              key={item.quizId} 
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-600"
            >
              {/* Quiz Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-2">
                    {item.quizTitle}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {/* Best Score */}
                    <span className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                      <FaTrophy /> Best: {item.bestScore}%
                    </span>
                    
                    {/* Attempts */}
                    <span className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                      <FaClock /> Attempts: {item.attempts}
                    </span>
                    
                    {/* Completed Status */}
                    {item.completed && (
                      <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                        <FaCheckCircle /> Completed
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Practice Button */}
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all text-sm font-medium whitespace-nowrap group"
                  onClick={() => navigate(`/quiz/${item.quizId}`)}
                >
                  Practice Again
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                      {item.bestScore}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200 dark:bg-gray-600">
                  <div 
                    style={{ width: `${item.bestScore}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserQuizProgress;