import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaUsers, 
  FaStar,
  FaBook,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import { quizService } from '../../../services/quiz.service';
import { TopicQuiz } from '../../../types/quiz.types';

interface JEETopicsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const JEETopicsPage: React.FC<JEETopicsPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const [topics, setTopics] = useState<TopicQuiz[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<TopicQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const validQuizId = quizId || '2'; // Default to JEE quiz (ID 2)

  useEffect(() => {
    fetchTopics();
  }, [quizId]);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const fetchedTopics = await quizService.getQuizTopics(Number(validQuizId));
      
      if (fetchedTopics && fetchedTopics.length > 0) {
        setTopics(fetchedTopics);
        setFilteredTopics(fetchedTopics);
      } else {
        // Mock JEE topics as fallback
        const mockTopics: TopicQuiz[] = [
          {
            id: 'jee-physics',
            title: 'Physics',
            description: 'Mechanics, Thermodynamics, Optics, Electromagnetism, Modern Physics',
            questionCount: 45,
            timeLimit: 60,
            difficulty: 'Hard',
            icon: '⚡',
            attempts: 3200,
            color: '#ef4444'
          },
          {
            id: 'jee-chemistry',
            title: 'Chemistry',
            description: 'Physical Chemistry, Organic Chemistry, Inorganic Chemistry',
            questionCount: 45,
            timeLimit: 55,
            difficulty: 'Medium',
            icon: '🧪',
            attempts: 3500,
            color: '#f59e0b'
          },
          {
            id: 'jee-mathematics',
            title: 'Mathematics',
            description: 'Calculus, Algebra, Trigonometry, Coordinate Geometry, Vectors',
            questionCount: 50,
            timeLimit: 65,
            difficulty: 'Hard',
            icon: '📐',
            attempts: 2800,
            color: '#ef4444'
          }
        ];
        setTopics(mockTopics);
        setFilteredTopics(mockTopics);
      }
    } catch (error) {
      console.error('Failed to fetch JEE topics:', error);
      
      // Mock JEE topics as fallback
      const mockTopics: TopicQuiz[] = [
        {
          id: 'jee-physics',
          title: 'Physics',
          description: 'Mechanics, Thermodynamics, Optics, Electromagnetism, Modern Physics',
          questionCount: 45,
          timeLimit: 60,
          difficulty: 'Hard',
          icon: '⚡',
          attempts: 3200,
          color: '#ef4444'
        },
        {
          id: 'jee-chemistry',
          title: 'Chemistry',
          description: 'Physical Chemistry, Organic Chemistry, Inorganic Chemistry',
          questionCount: 45,
          timeLimit: 55,
          difficulty: 'Medium',
          icon: '🧪',
          attempts: 3500,
          color: '#f59e0b'
        },
        {
          id: 'jee-mathematics',
          title: 'Mathematics',
          description: 'Calculus, Algebra, Trigonometry, Coordinate Geometry, Vectors',
          questionCount: 50,
          timeLimit: 65,
          difficulty: 'Hard',
          icon: '📐',
          attempts: 2800,
          color: '#ef4444'
        }
      ];
      setTopics(mockTopics);
      setFilteredTopics(mockTopics);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTopicsList = filteredTopics.filter(topic => {
    if (searchTerm) {
      return topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (activeFilter !== 'all') {
      return topic.difficulty.toLowerCase() === activeFilter.toLowerCase();
    }
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyBgColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleBackToQuizzes = () => {
    navigate('/quiz');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading JEE topics...</p>
        </div>
      </div>
    );
  }

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
            onClick={handleBackToQuizzes}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Quizzes
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">JEE Preparation Topics</h1>
          <p className="text-gray-600 dark:text-gray-300">Choose a subject to test your knowledge for JEE Main & Advanced</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{topics.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Subjects</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">9.5k</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Attempts</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaStar />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">4.7</h3>
              <p className="text-gray-600 dark:text-gray-300">Avg. Rating</p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          {/* Difficulty Filters */}
          <div className="mb-6">
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
                📋 Easy
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === 'medium'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveFilter('medium')}
              >
                📝 Medium
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === 'hard'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveFilter('hard')}
              >
                📊 Hard
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
              />
            </div>
            {filteredTopicsList.length > 0 && (
              <p className="text-right text-sm text-gray-600 dark:text-gray-400 mt-2">
                {filteredTopicsList.length} subjects found
              </p>
            )}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopicsList.length > 0 ? (
            filteredTopicsList.map((topic) => (
              <div 
                key={topic.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                onClick={() => navigate(`/quiz/${validQuizId}/topic/${topic.id}`)}
              >
                {/* Topic Header */}
                <div 
                  className="p-6 text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${topic.color || getDifficultyColor(topic.difficulty)}20, ${topic.color || getDifficultyColor(topic.difficulty)}40)`
                  }}
                >
                  <span className="text-5xl mb-3 block">
                    {topic.icon}
                  </span>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyBgColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </div>
                </div>
                
                {/* Topic Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{topic.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {topic.description.substring(0, 100)}...
                  </p>
                  
                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FaBook className="text-blue-500" /> {topic.questionCount} questions
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FaClock className="text-green-500" /> {topic.timeLimit} min
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FaUsers className="text-orange-500" /> {topic.attempts}+ attempts
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FaStar className="text-yellow-500" /> 4.7 rating
                    </div>
                  </div>

                  {/* Start Button */}
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 group">
                    Start Subject
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <span className="text-6xl block mb-4">📝</span>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No subjects found</h3>
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

export default JEETopicsPage;