import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaExternalLinkAlt,
  FaCode,
  FaSearch,
  FaRupeeSign,
  FaChartBar,
  FaLayerGroup,
  FaDollarSign,
  FaExclamationCircle,
  FaSpinner
} from 'react-icons/fa';
import { 
  SiLeetcode, 
  SiCodechef, 
  SiHackerrank, 
  SiGeeksforgeeks 
} from 'react-icons/si';
import { questionService, Question } from '../../services/question.service';
import { PRICING } from '../../constants/pricing';

// Topic mapping function - converts frontend topic IDs to database values
const mapTopicToDb = (topic: string): string => {
  const topicMap: Record<string, string> = {
    // DSA Topics
    'arrays': 'array-string',
    'linkedlist': 'linkedlist',
    'stack-queue': 'stack-queue',
    'trees-graphs': 'trees-graphs',
    'dp': 'dp',
    'searching-sorting': 'searching-sorting',
    'sliding-window': 'sliding-window',
    
    // JEE Topics
    'jee-physics': 'jee-physics',
    'jee-chemistry': 'jee-chemistry',
    'jee-mathematics': 'jee-mathematics',
    
    // NEET Topics
    'neet-biology': 'neet-biology',
    'neet-physics': 'neet-physics',
    'neet-chemistry': 'neet-chemistry',
    
    // UPSC Topics
    'upsc-history': 'upsc-history',
    'upsc-geography': 'upsc-geography',
    'upsc-polity': 'upsc-polity',
    'upsc-economics': 'upsc-economics',
    'upsc-environment': 'upsc-environment',
    
    // MHT CET Topics
    'mhtcet-physics': 'mhtcet-physics',
    'mhtcet-chemistry': 'mhtcet-chemistry',
    'mhtcet-mathematics': 'mhtcet-mathematics',
    'mhtcet-biology': 'mhtcet-biology'
  };
  
  return topicMap[topic] || topic;
};

interface BaseTopicQuizPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  topicId: string;
  topicName: string;
  topicIcon: string;
  topicColor: string;
  description: string;
  questionCount?: number;
  price?: number;
}

const BaseTopicQuizPage: React.FC<BaseTopicQuizPageProps> = ({
  darkMode,
  setDarkMode,
  topicId,
  topicName,
  topicIcon,
  topicColor,
  description,
  questionCount,
  price = PRICING.QUIZ_DEFAULT
}) => {
  const navigate = useNavigate();
  
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState<string[]>([]);

  // Fetch questions when component mounts or topic changes
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Map the topic ID to database format
        const dbTopic = mapTopicToDb(topicId);
        console.log(`📡 Fetching questions for topic: ${topicId} -> DB topic: ${dbTopic}`);
        
        const data = await questionService.getQuestionsByTopic(dbTopic);
        console.log(`✅ Loaded ${data.length} questions for ${topicId}`);
        
        setQuestions(data);
        setFilteredQuestions(data);
        
        // Get unique platforms
        const uniquePlatforms = Array.from(new Set(data.map((q: Question) => q.platform)));
        setPlatforms(uniquePlatforms);
        
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId]);

  // Filter questions based on selected platform, difficulty, and search
  useEffect(() => {
    let filtered = [...questions];
    
    if (selectedPlatform) {
      filtered = filtered.filter(q => q.platform.toLowerCase() === selectedPlatform.toLowerCase());
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    }
    
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredQuestions(filtered);
  }, [selectedPlatform, selectedDifficulty, searchTerm, questions]);

  // Handle platform click
  const handlePlatformClick = (platformId: string) => {
    setSelectedPlatform(platformId === selectedPlatform ? null : platformId);
  };

  // Handle back to all platforms
  const handleBackToPlatforms = () => {
    setSelectedPlatform(null);
  };

  // Handle question click
  const handleQuestionClick = (url: string) => {
    window.open(url, '_blank');
  };

  // Get platform color
  const getPlatformColor = (platform: string): string => {
    const colors: Record<string, string> = {
      leetcode: '#FFA116',
      geeksforgeeks: '#2F8D46',
      codechef: '#5B4638',
      hackerrank: '#00EA64'
    };
    return colors[platform.toLowerCase()] || '#6b7280';
  };

  // Get platform icon
  const getPlatformIcon = (platform: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      leetcode: <SiLeetcode />,
      geeksforgeeks: <SiGeeksforgeeks />,
      codechef: <SiCodechef />,
      hackerrank: <SiHackerrank />
    };
    return icons[platform.toLowerCase()] || <FaCode />;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    return questionService.getDifficultyColor(difficulty);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md text-center">
          <FaExclamationCircle className="text-6xl text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={() => selectedPlatform ? handleBackToPlatforms() : navigate('/quiz/1')}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            {selectedPlatform ? 'Back to Platforms' : 'Back to Topics'}
          </button>
          
          {/* Price Display */}
          {!selectedPlatform && (
            <div className="inline-flex items-center gap-1 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold">
              <FaRupeeSign /> {price}/-
            </div>
          )}
        </div>

        {/* Topic Header */}
        <div className="flex items-start gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-8 border-l-4" style={{ borderLeftColor: topicColor }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{ backgroundColor: `${topicColor}20`, color: topicColor }}>
            {topicIcon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{topicName}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
            {!selectedPlatform && (
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center gap-1">
                  <FaChartBar /> {questions.length} Problems
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center gap-1">
                  <FaLayerGroup /> {platforms.length} Platforms
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center gap-1">
                  <FaDollarSign /> ₹{price}/-
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Platform Selection View */}
        {!selectedPlatform ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Practice on Your Favorite Platform</h2>
            
            {platforms.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <p className="text-gray-600 dark:text-gray-300">No platforms available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platforms.map(platform => {
                  const platformQuestions = questions.filter(q => q.platform.toLowerCase() === platform.toLowerCase());
                  return (
                    <button
                      key={platform}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-left border-2 border-transparent hover:border-2"
                      style={{ borderColor: 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = getPlatformColor(platform)}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                      onClick={() => handlePlatformClick(platform)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl" style={{ color: getPlatformColor(platform) }}>
                          {getPlatformIcon(platform)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1 capitalize" style={{ color: getPlatformColor(platform) }}>
                            {platform}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">View {platform} problems</p>
                          <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                            {platformQuestions.length} problems
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Questions View for Selected Platform */
          <div className="space-y-6">
            {/* Selected Platform Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-2" style={{ color: getPlatformColor(selectedPlatform) }}>
                <span>{getPlatformIcon(selectedPlatform)}</span>
                <h2 className="capitalize">{selectedPlatform} Problems</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {topicName} • {questions.filter(q => q.platform.toLowerCase() === selectedPlatform.toLowerCase()).length} problems available
              </p>
            </div>

            {/* Filters Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
                />
              </div>

              {/* Difficulty Filters */}
              <div className="flex flex-wrap gap-2">
                {['all', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                  <button
                    key={difficulty}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedDifficulty === difficulty
                        ? difficulty === 'all'
                          ? 'bg-blue-500 text-white'
                          : difficulty === 'Easy'
                          ? 'bg-green-500 text-white'
                          : difficulty === 'Medium'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty === 'all' ? 'All' : difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Showing {filteredQuestions.length} of {questions.filter(q => q.platform.toLowerCase() === selectedPlatform.toLowerCase()).length} problems
                </h3>
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <FaSearch className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No problems found</h3>
                  <p className="text-gray-600 dark:text-gray-300">Try adjusting your filters</p>
                  {(selectedPlatform !== 'all' || selectedDifficulty !== 'all' || searchTerm) && (
                    <button 
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        setSelectedPlatform(null);
                        setSelectedDifficulty('all');
                        setSearchTerm('');
                      }}
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all group"
                      onClick={() => handleQuestionClick(question.url)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                          {index + 1}
                        </div>

                        <div className="text-xl" style={{ color: getPlatformColor(question.platform) }}>
                          {getPlatformIcon(question.platform)}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {question.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-sm">
                            <span className="text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1">
                              {getPlatformIcon(question.platform)} {question.platform}
                            </span>
                            <span 
                              className="text-xs font-semibold px-2 py-1 rounded-full"
                              style={{ 
                                backgroundColor: getDifficultyColor(question.difficulty) + '20',
                                color: getDifficultyColor(question.difficulty) 
                              }}
                            >
                              {question.difficulty}
                            </span>
                          </div>
                        </div>

                        <FaExternalLinkAlt className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseTopicQuizPage;