import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import YouTubePlayer from '../../components/core/YouTubePlayer';
import { 
  FaArrowLeft, 
  FaClock, 
  FaExternalLinkAlt,
  FaCode,
  FaUsers,
  FaStar,
  FaSearch,
  FaFilter,
  FaYoutube,
  FaChartBar,
  FaTag,
  FaSpinner,
  FaGripLines,
  FaLink,
  FaStackOverflow,
  FaTree,
  FaChartLine,
  FaSort,
  FaGraduationCap,
  FaChevronRight,
  FaPlay,
  FaLayerGroup as FaPlatforms,
  FaCheckCircle
} from 'react-icons/fa';
import { SiLeetcode, SiGeeksforgeeks, SiCodechef } from 'react-icons/si';
import { FaHackerrank } from 'react-icons/fa';
import { dsaPracticeService, DSAProblem } from '../../services/dsaPractice.service';
import { videoService, VideoLecture } from '../../services/video.service';

interface DSATopicQuizPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

interface PlatformInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

// Define TopicInfo type
interface TopicInfo {
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  videoId: string;
}

// Define TopicMap type with index signature
interface TopicMap {
  [key: string]: TopicInfo;
}

const DSATopicQuizPage: React.FC<DSATopicQuizPageProps> = ({ darkMode, setDarkMode }) => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [problems, setProblems] = useState<DSAProblem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<DSAProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videoLecture, setVideoLecture] = useState<VideoLecture | null>(null);
  const [topicInfo, setTopicInfo] = useState<{
    title: string;
    icon: React.ReactNode;
    color: string;
    description: string;
  }>({
    title: '',
    icon: <FaCode />,
    color: '',
    description: ''
  });

  // Platform configuration
  const platforms: Record<string, PlatformInfo> = {
    leetcode: {
      id: 'leetcode',
      name: 'LeetCode',
      icon: <SiLeetcode />,
      color: '#f89f1b',
      bgColor: 'rgba(248, 159, 27, 0.1)'
    },
    codechef: {
      id: 'codechef',
      name: 'CodeChef',
      icon: <SiCodechef />,
      color: '#5b4638',
      bgColor: 'rgba(91, 70, 56, 0.1)'
    },
    geeksforgeeks: {
      id: 'geeksforgeeks',
      name: 'GeeksforGeeks',
      icon: <SiGeeksforgeeks />,
      color: '#2f8d46',
      bgColor: 'rgba(47, 141, 70, 0.1)'
    },
    hackerrank: {
      id: 'hackerrank',
      name: 'HackerRank',
      icon: <FaHackerrank />,
      color: '#2ec866',
      bgColor: 'rgba(46, 200, 102, 0.1)'
    }
  };

  // Topic mapping with proper typing
  const topicMap: TopicMap = {
    'arrays': {
      title: 'Arrays',
      icon: <FaGripLines />,
      color: '#4299e1',
      description: 'Master array manipulation, searching, sorting, two-pointer technique, sliding window, and advanced array manipulations.',
      videoId: 'arrays'
    },
    'two-pointers': {
      title: 'Two Pointers',
      icon: <FaGripLines />,
      color: '#4299e1',
      description: 'Master two-pointer technique for solving array and string problems efficiently.',
      videoId: 'arrays'
    },
    'sliding-window': {
      title: 'Sliding Window',
      icon: <FaGripLines />,
      color: '#4299e1',
      description: 'Master sliding window technique for solving subarray and substring problems.',
      videoId: 'arrays'
    },
    'linkedlist': {
      title: 'Linked Lists',
      icon: <FaLink />,
      color: '#48bb78',
      description: 'Complete linked list problems including singly linked lists, doubly linked lists, circular lists, and advanced operations.',
      videoId: 'linkedlist'
    },
    'stack-queue': {
      title: 'Stacks & Queues',
      icon: <FaStackOverflow />,
      color: '#ed8936',
      description: 'Master stack and queue data structures, implementation, and problem-solving techniques.',
      videoId: 'stack-queue'
    },
    'trees-graphs': {
      title: 'Trees & Graphs',
      icon: <FaTree />,
      color: '#9f7aea',
      description: 'Complete tree and graph algorithms including BST, AVL, BFS, DFS, Dijkstra, and advanced graph problems.',
      videoId: 'trees-graphs'
    },
    'dp': {
      title: 'Dynamic Programming',
      icon: <FaChartLine />,
      color: '#f56565',
      description: 'Master DP from basics to advanced including knapsack, LCS, matrix chain, and optimization problems.',
      videoId: 'dp'
    },
    'searching-sorting': {
      title: 'Searching & Sorting',
      icon: <FaSort />,
      color: '#38b2ac',
      description: 'Complete searching and sorting algorithms including binary search, merge sort, quick sort, and hybrid algorithms.',
      videoId: 'searching-sorting'
    }
  };

  // Handle watch lecture click - navigate to course 22
  const handleWatchLecture = useCallback(() => {
    navigate('/courses/22');
  }, [navigate]);

  // Fetch problems from database
  useEffect(() => {
    const fetchData = async () => {
      if (!topicId) return;
      
      setIsLoading(true);
      try {
        // Set topic info if valid topic
        if (topicId in topicMap) {
          const topic = topicMap[topicId];
          setTopicInfo({
            title: topic.title,
            icon: topic.icon,
            color: topic.color,
            description: topic.description
          });
          
          // Fetch video lecture
          const video = await videoService.getVideoLecture(topic.videoId);
          setVideoLecture(video);
        }

        // Fetch problems from database
        const data = await dsaPracticeService.getProblemsByTopic(topicId);
        console.log(`📚 Fetched ${data.length} problems for topic: ${topicId}`, data);
        setProblems(data);
        setFilteredProblems(data);
      } catch (error) {
        console.error('❌ Failed to fetch problems:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  // Filter problems based on platform, difficulty, and search
  useEffect(() => {
    let filtered = problems;

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(p => p.platform === selectedPlatform);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(p => p.difficulty.toLowerCase() === difficultyFilter.toLowerCase());
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProblems(filtered);
  }, [selectedPlatform, difficultyFilter, searchTerm, problems]);

  const handleBack = useCallback(() => {
    navigate('/dsa');
  }, [navigate]);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platforms[platform]?.icon || <FaCode />;
  };

  const getPlatformColor = (platform: string) => {
    return platforms[platform]?.color || '#6366f1';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading problems...</p>
        </div>
      </div>
    );
  }

  // Rest of your JSX remains exactly the same...
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
            onClick={handleBack}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to DSA Topics
          </button>
        </div>

        {/* Topic Header with prominent Watch Lecture Button */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl text-white flex-shrink-0"
              style={{ background: topicInfo.color }}
            >
              {topicInfo.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{topicInfo.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{topicInfo.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center gap-1">
                  <FaChartBar /> {problems.length} Problems
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center gap-1">
                  <FaPlatforms /> 4 Platforms
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center gap-1">
                  <FaTag /> Mixed Difficulties
                </span>
              </div>
            </div>
            
            {/* Prominent Watch Full Lecture Button */}
            <button
              onClick={handleWatchLecture}
              className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="bg-white/20 p-2 rounded-full">
                <FaPlay className="text-white text-sm" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-red-100">Complete Course</div>
                <div className="font-bold flex items-center gap-1">
                  Watch Full Lecture <FaChevronRight className="text-sm" />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Video Lecture Section */}
        {videoLecture && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FaYoutube className="text-3xl text-red-500" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Video Lecture: {videoLecture.title}</h2>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <FaClock /> {videoLecture.durationMinutes} min
                  </span>
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <FaUsers /> {videoLecture.students?.toLocaleString()}+ students
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500">
                    <FaStar /> {videoLecture.rating}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/3">
                  <YouTubePlayer
                    key={videoLecture.id}
                    videoUrl={videoLecture.videoUrl}
                    title={videoLecture.title}
                    autoPlay={false}
                  />
                </div>
                <div className="lg:w-1/3 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">About this Lecture</h3>
                  <p className="text-gray-600 dark:text-gray-300">{videoLecture.description}</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-500 text-xs" />
                      Comprehensive coverage of all {topicInfo.title} concepts
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-500 text-xs" />
                      Problem-solving strategies and techniques
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-500 text-xs" />
                      Interview question walkthroughs
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Selection View - COMPACT HORIZONTAL CARDS */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FaPlatforms className="text-blue-500" /> Practice on Your Favorite Platform
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* All Platforms Card */}
            <button
              className={`bg-white dark:bg-gray-800 rounded-xl shadow p-4 hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-left border-2 ${
                selectedPlatform === 'all' ? 'border-blue-500' : 'border-transparent hover:border-blue-300'
              }`}
              onClick={() => setSelectedPlatform('all')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl text-blue-500 mb-2">
                  <FaCode />
                </div>
                <h3 className="text-sm font-bold mb-1 text-gray-800 dark:text-white">
                  All Platforms
                </h3>
                <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                  {problems.length} problems
                </span>
              </div>
            </button>

            {/* Individual Platform Cards */}
            {Object.entries(platforms).map(([key, platform]) => {
              const platformProblems = problems.filter(p => p.platform === key);
              const isSelected = selectedPlatform === key;
              return (
                <button
                  key={key}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow p-4 hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-left border-2 ${
                    isSelected ? 'border-blue-500' : 'border-transparent hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedPlatform(key)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-3xl mb-2" style={{ color: platform.color }}>
                      {platform.icon}
                    </div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: platform.color }}>
                      {platform.name}
                    </h3>
                    <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                      {platformProblems.length} problems
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and Difficulty Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <FaFilter /> Difficulty:
              </span>
              <div className="flex gap-2">
                {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      difficultyFilter === diff.toLowerCase()
                        ? diff === 'all' 
                          ? 'bg-blue-500 text-white'
                          : diff === 'Easy'
                          ? 'bg-green-500 text-white'
                          : diff === 'Medium'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setDifficultyFilter(diff.toLowerCase())}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-right text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center justify-end gap-2">
          <FaChartBar /> Showing {filteredProblems.length} of {problems.length} problems
        </div>

        {/* Questions List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="space-y-3">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem, index) => (
                <div
                  key={problem.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all group"
                  onClick={() => window.open(problem.url, '_blank')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {index + 1}
                    </div>

                    <div className="text-xl" style={{ color: getPlatformColor(problem.platform) }}>
                      {getPlatformIcon(problem.platform)}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {problem.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1">
                          {getPlatformIcon(problem.platform)} {problem.platform}
                        </span>
                        <span 
                          className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: getDifficultyColor(problem.difficulty) + '20',
                            color: getDifficultyColor(problem.difficulty) 
                          }}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>

                    <FaExternalLinkAlt className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FaSearch className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No problems found</h3>
                <p className="text-gray-600 dark:text-gray-300">Try adjusting your filters or search term</p>
                {(selectedPlatform !== 'all' || difficultyFilter !== 'all' || searchTerm) && (
                  <button 
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setSelectedPlatform('all');
                      setDifficultyFilter('all');
                      setSearchTerm('');
                    }}
                  >
                    <FaGraduationCap className="inline mr-2" /> Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSATopicQuizPage;