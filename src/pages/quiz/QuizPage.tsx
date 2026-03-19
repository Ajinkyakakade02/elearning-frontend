import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaUsers, 
  FaStar,
  FaBook,
  FaFilter,
  FaSearch,
  FaBrain,
  FaCode,
  FaFlask,
  FaRupeeSign
} from 'react-icons/fa';

interface QuizPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const quizSeries = [
    {
      id: 1,
      title: 'DSA Quiz Series',
      description: 'Master Data Structures & Algorithms with comprehensive topic-wise quizzes',
      icon: <FaCode />,
      color: '#4299e1',
      topicCount: 8,
      totalQuestions: 120,
      difficulty: 'Mixed',
      students: 12500,
      rating: 4.8,
      price: 99
    },
    {
      id: 2,
      title: 'JEE Quiz Series',
      description: 'Complete JEE preparation with Physics, Chemistry, and Mathematics quizzes',
      icon: <FaFlask />,
      color: '#48bb78',
      topicCount: 3,
      totalQuestions: 150,
      difficulty: 'Advanced',
      students: 23400,
      rating: 4.9,
      price: 99
    },
    {
      id: 3,
      title: 'NEET Quiz Series',
      description: 'Comprehensive NEET preparation with Biology, Physics, and Chemistry quizzes',
      icon: <FaBrain />,
      color: '#ed8936',
      topicCount: 3,
      totalQuestions: 140,
      difficulty: 'Medium',
      students: 18900,
      rating: 4.7,
      price: 99
    },
    {
      id: 5,
      title: 'MHT CET Quiz Series',
      description: 'Complete preparation for MHT CET entrance exam with chapter-wise tests',
      icon: <FaBook />,
      color: '#f56565',
      topicCount: 12,
      totalQuestions: 150,
      difficulty: 'Medium',
      students: 8900,
      rating: 4.6,
      price: 99
    }
  ];

  const [filteredSeries, setFilteredSeries] = useState(quizSeries);

  useEffect(() => {
    let filtered = [...quizSeries];
    
    if (searchTerm) {
      filtered = filtered.filter(series =>
        series.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        series.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(series =>
        series.difficulty.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    setFilteredSeries(filtered);
  }, [searchTerm, activeFilter, quizSeries]); // Added quizSeries to dependencies

  const getDifficultyBgColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      case 'mixed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return '🌱';
      case 'medium': return '📈';
      case 'advanced': return '🚀';
      case 'mixed': return '🔄';
      default: return '📊';
    }
  };

  // BACK NAVIGATION - to dashboard
  const handleBack = () => {
    navigate('/dashboard', { replace: true });
  };

  // FORWARD NAVIGATION - to quiz topics page (shows subjects)
  const handleQuizClick = (quizId: number) => {
    navigate(`/quiz/${quizId}`);
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
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Practice Quizzes</h1>
          <p className="text-gray-600 dark:text-gray-300">Test your knowledge with comprehensive quiz series - All at ₹99/-</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{quizSeries.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Quiz Series</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">70.4k+</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Attempts</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaStar />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">4.8</h3>
              <p className="text-gray-600 dark:text-gray-300">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">All quiz series at just ₹99/-! Unlimited attempts.</span>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-200">
            <FaFilter /> <span className="font-medium">Filter by Difficulty:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              📚 All
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                activeFilter === 'easy'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter('easy')}
            >
              🌱 Easy
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                activeFilter === 'medium'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter('medium')}
            >
              📈 Medium
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all ${
                activeFilter === 'advanced'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter('advanced')}
            >
              🚀 Advanced
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search quiz series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
            />
          </div>
          {filteredSeries.length > 0 && (
            <p className="text-right text-sm text-gray-600 dark:text-gray-400 mt-2">
              {filteredSeries.length} series found
            </p>
          )}
        </div>

        {/* Quiz Series Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeries.length > 0 ? (
            filteredSeries.map((series) => (
              <div 
                key={series.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                onClick={() => handleQuizClick(series.id)}
              >
                {/* Series Header */}
                <div 
                  className="p-6 text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${series.color}20, ${series.color}40)`
                  }}
                >
                  <div className="text-5xl mb-3 flex justify-center">
                    {series.icon}
                  </div>
                  <div 
                    className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold ${getDifficultyBgColor(series.difficulty)}`}
                  >
                    {getDifficultyIcon(series.difficulty)} {series.difficulty}
                  </div>
                </div>
                
                {/* Series Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{series.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {series.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaBook className="text-blue-500" /> {series.topicCount} topics
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaClock className="text-green-500" /> {series.totalQuestions} questions
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaUsers className="text-orange-500" /> {series.students.toLocaleString()}+
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaStar className="text-yellow-500" /> {series.rating}
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold mb-4">
                    <FaRupeeSign /> 99/-
                  </div>

                  {/* Explore Button */}
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 group">
                    Explore Series @ ₹99
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <span className="text-6xl block mb-4">🔍</span>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No quiz series found</h3>
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

export default QuizPage;