import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaUsers, 
  FaStar,
  FaBook,
  FaFilter,
  FaSearch,
  FaRupeeSign,
  FaSeedling,
  FaChartBar,
  FaRocket,
  FaLayerGroup
} from 'react-icons/fa';

interface BaseQuizPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  quizId: number;
  quizTitle: string;
  quizDescription: string;
  quizIcon: React.ReactNode;
  topics: any[];
  stats: {
    totalTopics: number;
    totalQuestions: number;
    totalAttempts: number;
    avgRating: number | string;
    totalValue?: number;
  };
}

const BaseQuizPage: React.FC<BaseQuizPageProps> = ({
  darkMode,
  setDarkMode,
  quizId,
  quizTitle,
  quizDescription,
  quizIcon,
  topics,
  stats
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Format stats values properly
  const formattedAvgRating = typeof stats.avgRating === 'number' 
    ? stats.avgRating.toFixed(1) 
    : parseFloat(stats.avgRating).toFixed(1);

  const filteredTopics = topics.filter((topic: any) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = activeFilter === 'all' || topic.difficulty.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  const handleBack = () => {
    navigate('/quiz');
  };

  const handleTopicClick = (path: string) => {
    navigate(path);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyBgColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return <FaSeedling />;
      case 'medium': return <FaChartBar />;
      case 'hard': return <FaRocket />;
      default: return <FaLayerGroup />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={handleBack}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Quizzes
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl">{quizIcon}</span>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{quizTitle}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{quizDescription}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalTopics}</h3>
              <p className="text-gray-600 dark:text-gray-300">Topics</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalAttempts.toLocaleString()}+</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Attempts</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaStar />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{formattedAvgRating}</h3>
              <p className="text-gray-600 dark:text-gray-300">Avg Rating</p>
            </div>
          </div>

          {stats.totalValue && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl">
                <FaRupeeSign />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">₹ {stats.totalValue}/-</h3>
                <p className="text-gray-600 dark:text-gray-300">Complete Bundle</p>
              </div>
            </div>
          )}
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">All topics at just ₹99/- each! Unlimited attempts.</span>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-200">
            <FaFilter /> <span className="font-medium">Filter by Difficulty:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeFilter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              <FaLayerGroup /> All
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeFilter === 'easy'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter('easy')}
            >
              <FaSeedling /> Easy
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeFilter === 'medium'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter('medium')}
            >
              <FaChartBar /> Medium
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeFilter === 'hard'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter('hard')}
            >
              <FaRocket /> Hard
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
            />
          </div>
          {filteredTopics.length > 0 && (
            <p className="text-right text-sm text-gray-600 dark:text-gray-400 mt-2">
              {filteredTopics.length} topics found
            </p>
          )}
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic: any) => (
              <div 
                key={topic.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                onClick={() => handleTopicClick(topic.path)}
              >
                {/* Topic Header */}
                <div 
                  className="p-6 text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${topic.color}20, ${topic.color}40)`
                  }}
                >
                  <span className="text-5xl mb-3 block">
                    {topic.icon}
                  </span>
                  <div 
                    className={`inline-flex items-center gap-1 px-4 py-1 rounded-full text-white text-sm font-semibold ${getDifficultyBgColor(topic.difficulty)}`}
                  >
                    {getDifficultyIcon(topic.difficulty)} {topic.difficulty}
                  </div>
                </div>
                
                {/* Topic Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{topic.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {topic.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaBook className="text-blue-500" /> {topic.questionCount} questions
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaClock className="text-green-500" /> {topic.timeLimit} min
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaUsers className="text-orange-500" /> {topic.attempts.toLocaleString()}+
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaStar className="text-yellow-500" /> {topic.rating}
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold mb-4">
                    <FaRupeeSign /> {topic.price}/-
                  </div>

                  {/* Start Button */}
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 group">
                    Start Quiz @ ₹99
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <FaSearch className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No topics found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your search or filter</p>
              {(searchTerm || activeFilter !== 'all') && (
                <button 
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseQuizPage;