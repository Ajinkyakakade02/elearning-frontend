import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaUsers, 
  FaStar,
  FaBook,
  FaFilter,
  FaSearch,
  FaRupeeSign
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../utils/toast';

interface QuizSubtopicsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const QuizSubtopicsPage: React.FC<QuizSubtopicsPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { quizId, subjectId } = useParams<{ quizId: string; subjectId: string }>();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Define subtopics based on quizId and subjectId
  const getSubtopics = () => {
    // JEE Chemistry subtopics
    if (quizId === '2' && subjectId === 'chemistry') {
      return [
        {
          id: 'physical-chemistry',
          title: 'Physical Chemistry',
          description: 'Mole Concept, Atomic Structure, Thermodynamics, Equilibrium, Kinetics, Electrochemistry',
          icon: '⚡',
          color: '#3b82f6',
          questionCount: 45,
          timeLimit: 50,
          difficulty: 'Hard',
          attempts: 4200,
          rating: 4.8,
          price: 99,
          topics: [
            'Mole Concept',
            'Atomic Structure',
            'Thermodynamics',
            'Chemical Equilibrium',
            'Electrochemistry',
            'Chemical Kinetics'
          ]
        },
        {
          id: 'inorganic-chemistry',
          title: 'Inorganic Chemistry',
          description: 'Periodic Table, Chemical Bonding, Coordination Compounds, p-block, d-block',
          icon: '🧪',
          color: '#10b981',
          questionCount: 40,
          timeLimit: 45,
          difficulty: 'Hard',
          attempts: 3800,
          rating: 4.7,
          price: 99,
          topics: [
            'Periodic Table',
            'Chemical Bonding',
            'Coordination Compounds',
            'p-Block Elements',
            'd & f Block Elements'
          ]
        },
        {
          id: 'organic-chemistry',
          title: 'Organic Chemistry',
          description: 'GOC, Hydrocarbons, Halogen Compounds, Alcohols, Aldehydes, Ketones',
          icon: '🌿',
          color: '#8b5cf6',
          questionCount: 45,
          timeLimit: 50,
          difficulty: 'Hard',
          attempts: 4500,
          rating: 4.9,
          price: 99,
          topics: [
            'General Organic Chemistry',
            'Hydrocarbons',
            'Haloalkanes & Haloarenes',
            'Alcohols & Ethers',
            'Aldehydes & Ketones'
          ]
        }
      ];
    }
    
    // JEE Physics subtopics
    else if (quizId === '2' && subjectId === 'physics') {
      return [
        {
          id: 'mechanics',
          title: 'Mechanics',
          description: 'Kinematics, Laws of Motion, Work, Energy, Power, Rotational Motion',
          icon: '⚙️',
          color: '#4299e1',
          questionCount: 40,
          timeLimit: 45,
          difficulty: 'Hard',
          attempts: 5200,
          rating: 4.8,
          price: 99,
          topics: ['Kinematics', 'Laws of Motion', 'Work & Energy', 'Rotational Motion']
        },
        {
          id: 'thermodynamics',
          title: 'Thermodynamics',
          description: 'Thermal Physics, Kinetic Theory, Thermodynamic Processes',
          icon: '🔥',
          color: '#f56565',
          questionCount: 25,
          timeLimit: 30,
          difficulty: 'Medium',
          attempts: 3400,
          rating: 4.6,
          price: 99,
          topics: ['Thermodynamics', 'Kinetic Theory', 'Heat Transfer']
        },
        {
          id: 'optics',
          title: 'Optics',
          description: 'Ray Optics, Wave Optics, Optical Instruments',
          icon: '🔦',
          color: '#ed8936',
          questionCount: 30,
          timeLimit: 35,
          difficulty: 'Medium',
          attempts: 3800,
          rating: 4.7,
          price: 99,
          topics: ['Ray Optics', 'Wave Optics', 'Interference', 'Diffraction']
        }
      ];
    }
    
    // NEET Biology subtopics
    else if (quizId === '3' && subjectId === 'biology') {
      return [
        {
          id: 'botany',
          title: 'Botany',
          description: 'Plant Kingdom, Morphology, Anatomy, Physiology, Ecology',
          icon: '🌿',
          color: '#10b981',
          questionCount: 40,
          timeLimit: 45,
          difficulty: 'Medium',
          attempts: 6800,
          rating: 4.8,
          price: 99,
          topics: ['Plant Kingdom', 'Morphology', 'Anatomy', 'Plant Physiology']
        },
        {
          id: 'zoology',
          title: 'Zoology',
          description: 'Animal Kingdom, Human Physiology, Reproduction, Evolution',
          icon: '🦁',
          color: '#f59e0b',
          questionCount: 40,
          timeLimit: 45,
          difficulty: 'Medium',
          attempts: 7200,
          rating: 4.8,
          price: 99,
          topics: ['Animal Kingdom', 'Human Physiology', 'Reproduction', 'Evolution']
        },
        {
          id: 'genetics',
          title: 'Genetics & Biotechnology',
          description: 'Molecular Biology, Genetics, Biotechnology, Evolution',
          icon: '🧬',
          color: '#8b5cf6',
          questionCount: 30,
          timeLimit: 35,
          difficulty: 'Medium',
          attempts: 5400,
          rating: 4.7,
          price: 99,
          topics: ['Molecular Basis', 'Genetics', 'Biotechnology', 'Evolution']
        }
      ];
    }
    
    // Default empty array
    return [];
  };

  const subtopics = getSubtopics();
  const [filteredSubtopics, setFilteredSubtopics] = useState(subtopics);

  useEffect(() => {
    let filtered = [...subtopics];
    
    if (searchTerm) {
      filtered = filtered.filter(subtopic =>
        subtopic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subtopic.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(subtopic =>
        subtopic.difficulty.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    setFilteredSubtopics(filtered);
  }, [searchTerm, activeFilter, subtopics]); // Added subtopics to dependencies

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
      case 'easy': return '🌱';
      case 'medium': return '📈';
      case 'hard': return '🚀';
      default: return '📊';
    }
  };

  // Get titles based on params
  const getParentTitle = () => {
    if (quizId === '2' && subjectId === 'chemistry') return 'JEE Chemistry';
    if (quizId === '2' && subjectId === 'physics') return 'JEE Physics';
    if (quizId === '2' && subjectId === 'mathematics') return 'JEE Mathematics';
    if (quizId === '3' && subjectId === 'biology') return 'NEET Biology';
    if (quizId === '3' && subjectId === 'physics') return 'NEET Physics';
    if (quizId === '3' && subjectId === 'chemistry') return 'NEET Chemistry';
    return 'Quiz';
  };

  // BACK NAVIGATION - to subjects page
  const handleBack = () => {
    navigate(`/quiz/${quizId}`, { replace: true });
  };

  // FORWARD NAVIGATION - to quiz taking page with purchase check
  const handleSubtopicClick = (subtopicId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      showToast.error('Please login to access quizzes');
      navigate('/login');
      return;
    }

    // Navigate to quiz taking page (purchase will be handled there)
    navigate(`/quiz/${quizId}/${subjectId}/${subtopicId}`);
  };

  // Calculate total bundle value
  const totalValue = subtopics.length * 99;

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
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Subjects
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{getParentTitle()}</h1>
          <p className="text-gray-600 dark:text-gray-300">Choose a topic to start the quiz - All at ₹99/-</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{subtopics.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Topics</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {subtopics.reduce((sum, s) => sum + s.attempts, 0).toLocaleString()}+
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Total Attempts</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaRupeeSign />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">₹ {totalValue}/-</h3>
              <p className="text-gray-600 dark:text-gray-300">Complete Bundle</p>
            </div>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">All topics at just ₹99/- each! One-time purchase, lifetime access.</span>
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
                activeFilter === 'hard'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter('hard')}
            >
              🚀 Hard
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
          {filteredSubtopics.length > 0 && (
            <p className="text-right text-sm text-gray-600 dark:text-gray-400 mt-2">
              {filteredSubtopics.length} topics found
            </p>
          )}
        </div>

        {/* Subtopics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubtopics.length > 0 ? (
            filteredSubtopics.map((subtopic) => (
              <div 
                key={subtopic.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                onClick={() => handleSubtopicClick(subtopic.id)}
              >
                {/* Topic Header */}
                <div 
                  className="p-6 text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${subtopic.color}20, ${subtopic.color}40)`
                  }}
                >
                  <span className="text-5xl mb-3 block">
                    {subtopic.icon}
                  </span>
                  <div 
                    className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold ${getDifficultyBgColor(subtopic.difficulty)}`}
                  >
                    {getDifficultyIcon(subtopic.difficulty)} {subtopic.difficulty}
                  </div>
                </div>
                
                {/* Topic Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{subtopic.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {subtopic.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaBook className="text-blue-500" /> {subtopic.questionCount} questions
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaClock className="text-green-500" /> {subtopic.timeLimit} min
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaUsers className="text-orange-500" /> {subtopic.attempts.toLocaleString()}+
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaStar className="text-yellow-500" /> {subtopic.rating}
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold mb-4">
                    <FaRupeeSign /> 99/-
                  </div>

                  {/* Topics Preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {subtopic.topics.slice(0, 3).map((topic: string, idx: number) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                      >
                        {topic.length > 20 ? topic.substring(0, 20) + '...' : topic}
                      </span>
                    ))}
                    {subtopic.topics.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        +{subtopic.topics.length - 3} more
                      </span>
                    )}
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
              <span className="text-6xl block mb-4">🔍</span>
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

export default QuizSubtopicsPage;