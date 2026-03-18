import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCode, 
  FaProjectDiagram, 
  FaChartLine, 
  FaBook,
  FaArrowLeft,
  FaStar,
  FaUsers,
  FaClock,
  FaRupeeSign,
  FaSeedling,
  FaChartBar,
  FaRocket,
  FaLayerGroup,
  FaSearch
} from 'react-icons/fa';

interface QuizDSATopicsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizDSATopicsPage: React.FC<QuizDSATopicsPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  
  const topics = [
    {
      id: 'arrays',
      title: 'Arrays & Strings',
      description: 'Master array manipulation, searching, sorting, two-pointer technique, sliding window, and string algorithms.',
      icon: <FaCode />,
      color: '#4299e1',
      questionCount: 80,
      timeLimit: 120,
      difficulty: 'Medium' as const,
      attempts: 15000,
      rating: 4.8,
      path: '/quiz/1/topic/arrays',
      price: 99
    },
    {
      id: 'linkedlist',
      title: 'Linked Lists',
      description: 'Complete linked list problems including singly linked lists, doubly linked lists, circular lists, and advanced operations.',
      icon: <FaProjectDiagram />,
      color: '#48bb78',
      questionCount: 60,
      timeLimit: 90,
      difficulty: 'Medium' as const,
      attempts: 12000,
      rating: 4.7,
      path: '/quiz/1/topic/linkedlist',
      price: 99
    },
    {
      id: 'stack-queue',
      title: 'Stacks & Queues',
      description: 'Master stack and queue data structures, implementation, and problem-solving techniques.',
      icon: <FaChartLine />,
      color: '#ed8936',
      questionCount: 50,
      timeLimit: 75,
      difficulty: 'Medium' as const,
      attempts: 10000,
      rating: 4.6,
      path: '/quiz/1/topic/stack-queue',
      price: 99
    },
    {
      id: 'trees-graphs',
      title: 'Trees & Graphs',
      description: 'Complete tree and graph algorithms including BST, AVL, BFS, DFS, Dijkstra, and advanced graph problems.',
      icon: <FaProjectDiagram />,
      color: '#9f7aea',
      questionCount: 100,
      timeLimit: 150,
      difficulty: 'Hard' as const,
      attempts: 18000,
      rating: 4.9,
      path: '/quiz/1/topic/trees-graphs',
      price: 99
    },
    {
      id: 'dp',
      title: 'Dynamic Programming',
      description: 'Master DP from basics to advanced including knapsack, LCS, matrix chain, and optimization problems.',
      icon: <FaChartLine />,
      color: '#f56565',
      questionCount: 70,
      timeLimit: 105,
      difficulty: 'Hard' as const,
      attempts: 20000,
      rating: 4.9,
      path: '/quiz/1/topic/dp',
      price: 99
    },
    {
      id: 'searching-sorting',
      title: 'Searching & Sorting',
      description: 'Complete searching and sorting algorithms including binary search, merge sort, quick sort, and hybrid algorithms.',
      icon: <FaCode />,
      color: '#38b2ac',
      questionCount: 40,
      timeLimit: 60,
      difficulty: 'Easy' as const,
      attempts: 14000,
      rating: 4.7,
      path: '/quiz/1/topic/searching-sorting',
      price: 99
    }
  ];

  const stats = {
    totalTopics: topics.length,
    totalQuestions: topics.reduce((sum, t) => sum + t.questionCount, 0),
    totalAttempts: topics.reduce((sum, t) => sum + t.attempts, 0),
    avgRating: (topics.reduce((sum, t) => sum + t.rating, 0) / topics.length),
    totalValue: topics.length * 99
  };

  const handleDSASheetClick = () => {
    navigate('/dsa/sheet');
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return <FaSeedling />;
      case 'medium': return <FaChartBar />;
      case 'hard': return <FaRocket />;
      default: return <FaLayerGroup />;
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
            onClick={() => navigate('/quiz')}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Quizzes
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">DSA Quiz Series</h1>
          <p className="text-gray-600 dark:text-gray-300">Master Data Structures & Algorithms with comprehensive topic-wise quizzes - All at ₹99/-</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaCode />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalTopics}</h3>
              <p className="text-gray-600 dark:text-gray-300">Topics</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaCode />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalQuestions}+</h3>
              <p className="text-gray-600 dark:text-gray-300">Questions</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalAttempts.toLocaleString()}+</h3>
              <p className="text-gray-600 dark:text-gray-300">Attempts</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaStar />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.avgRating.toFixed(1)}</h3>
              <p className="text-gray-600 dark:text-gray-300">Rating</p>
            </div>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">All topics at just ₹99/- each! Unlimited attempts.</span>
        </div>

        {/* DSA Sheet Promo Banner */}
        <div 
          className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl p-6 mb-8 cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
          onClick={handleDSASheetClick}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-xl p-4">
                <FaBook className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">📚 DSA Sheet - 300+ Problems</h2>
                <p className="text-white/80">Pattern-wise • Top 150 • Blind 75 • All at ₹99/-</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 group">
              View Sheet <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-200">
            <span className="font-medium">Filter by Difficulty:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
            >
              <FaLayerGroup /> All
            </button>
            <button
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-all"
              style={{ color: '#10b981' }}
            >
              <FaSeedling /> Easy
            </button>
            <button
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-all"
              style={{ color: '#f59e0b' }}
            >
              <FaChartBar /> Medium
            </button>
            <button
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-all"
              style={{ color: '#ef4444' }}
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
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div 
              key={topic.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              onClick={() => navigate(topic.path)}
            >
              {/* Topic Header */}
              <div 
                className="p-6 text-center"
                style={{ 
                  background: `linear-gradient(135deg, ${topic.color}20, ${topic.color}40)`
                }}
              >
                <div className="text-5xl mb-3 flex justify-center">
                  {topic.icon}
                </div>
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
                    <FaCode className="text-blue-500" /> {topic.questionCount} questions
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizDSATopicsPage;