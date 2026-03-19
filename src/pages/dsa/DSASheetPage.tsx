import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaBook, 
  FaExternalLinkAlt,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaCode,
  FaStar,
  FaAward,
  FaRupeeSign,
  FaSpinner
} from 'react-icons/fa';
import { questionService, Question } from '../../services/question.service';

interface DSASheetPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

interface Section {
  id: string;
  title: string;
  icon: JSX.Element;
  color: string;
  description: string;
  price: number;
  quizPath: string;
  topicFilter: string;
  questionCount: number;
  questions: Question[];
}

const DSASheetPage: React.FC<DSASheetPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string>('patterns');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<string>('patterns');
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  // Define section structure
  const sectionDefinitions = [
    {
      id: 'patterns',
      title: 'All DSA Patterns',
      icon: <FaCode />,
      color: '#6366f1',
      description: 'Comprehensive collection of questions organized by DSA patterns',
      price: 99,
      quizPath: '/quiz/1',
      topicFilter: 'pattern',
    },
    {
      id: 'top150',
      title: 'Top 150 Interview Questions',
      icon: <FaStar />,
      color: '#f59e0b',
      description: 'Most frequently asked interview questions from LeetCode Top 150',
      price: 99,
      quizPath: '/quiz/1',
      topicFilter: 'top',
    },
    {
      id: 'top75',
      title: 'Blind 75 - Top Questions',
      icon: <FaAward />,
      color: '#10b981',
      description: 'The famous Blind 75 list - must-do questions for coding interviews',
      price: 99,
      quizPath: '/quiz/1',
      topicFilter: 'blind',
    }
  ];

  // Fetch questions from database - wrapped in useCallback
  const fetchAllQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const allQuestions = await questionService.getAllQuestions();
      console.log('📚 Fetched all questions:', allQuestions.length);

      const patternQuestions = allQuestions.filter(q => 
        q.questionId?.includes('pattern') || 
        (q.id >= 7301 && q.id <= 7358)
      );
      
      const top150Questions = allQuestions.filter(q => 
        q.questionId?.includes('top') || 
        (q.id >= 7101 && q.id <= 7250)
      );
      
      const top75Questions = allQuestions.filter(q => 
        q.questionId?.includes('blind') || 
        (q.id >= 7001 && q.id <= 7078)
      );

      const sectionsWithQuestions: Section[] = [
        {
          ...sectionDefinitions[0],
          questionCount: patternQuestions.length,
          questions: patternQuestions,
        },
        {
          ...sectionDefinitions[1],
          questionCount: top150Questions.length,
          questions: top150Questions,
        },
        {
          ...sectionDefinitions[2],
          questionCount: top75Questions.length,
          questions: top75Questions,
        }
      ];

      setSections(sectionsWithQuestions);
      
      const activeSectionData = sectionsWithQuestions.find(s => s.id === activeSection);
      if (activeSectionData) {
        setFilteredQuestions(activeSectionData.questions);
      }
    } catch (error) {
      console.error('❌ Failed to fetch questions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeSection]); // Add activeSection as dependency

  // Fetch questions on mount
  useEffect(() => {
    fetchAllQuestions();
  }, [fetchAllQuestions]);

  // Update filtered questions when filters change
  useEffect(() => {
    const currentSection = sections.find(s => s.id === activeSection);
    if (!currentSection) return;

    let filtered = currentSection.questions;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(q => 
        q.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    setFilteredQuestions(filtered);
  }, [searchTerm, difficultyFilter, activeSection, sections]);

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection('');
    } else {
      setExpandedSection(sectionId);
      setActiveSection(sectionId);
      setSearchTerm('');
      setDifficultyFilter('all');
    }
  };

  // REMOVED: getDifficultyColor is not used anywhere
  // const getDifficultyColor = (difficulty: string) => {
  //   switch(difficulty?.toLowerCase()) {
  //     case 'easy': return '#10b981';
  //     case 'medium': return '#f59e0b';
  //     case 'hard': return '#ef4444';
  //     default: return '#6b7280';
  //   }
  // };

  const getDifficultyBgColor = (difficulty: string) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleNavigateToQuiz = () => {
    navigate('/quiz/1');
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/dsa');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading DSA Sheet questions...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = sections.reduce((sum, section) => sum + section.questionCount, 0);
  const activeSectionData = sections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 group"
            onClick={handleBack}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">DSA Sheet</h1>
          <p className="text-gray-600 dark:text-gray-300">Comprehensive collection of LeetCode problems for interview preparation - All at ₹99/- per sheet</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl" style={{ background: section.color }}>
                {section.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{section.questionCount}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {index === 0 ? 'Pattern Qs' : index === 1 ? 'Top 150' : 'Blind 75'}
                </p>
              </div>
            </div>
          ))}

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl" style={{ background: '#8b5cf6' }}>
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalQuestions}</h3>
              <p className="text-gray-600 dark:text-gray-300">Total</p>
            </div>
          </div>
        </div>

        {/* Special Offer Banner with Navigation */}
        <div 
          className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 mb-8 flex items-center justify-center gap-3 cursor-pointer hover:from-yellow-500 hover:to-orange-500 transition-all"
          onClick={handleNavigateToQuiz}
        >
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">All DSA sheets at just ₹99/- each! Get lifetime access.</span>
          <span className="ml-2 text-white/80">→ Practice Quizzes</span>
        </div>

        {/* Sections Cards */}
        <div className="space-y-4 mb-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-2xl ${
                activeSection === section.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ borderTop: `4px solid ${section.color}` }}
              onClick={() => toggleSection(section.id)}
            >
              <div className="p-6 flex items-center gap-6">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-3xl flex-shrink-0"
                  style={{ background: section.color }}
                >
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{section.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{section.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{section.questionCount} Questions</span>
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                      <FaRupeeSign /> {section.price}/-
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(section.quizPath);
                      }}
                      className="ml-auto px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Practice Quiz →
                    </button>
                  </div>
                </div>
                <div className="text-2xl text-gray-400">
                  {expandedSection === section.id ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expanded Section Content */}
        {expandedSection && activeSectionData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
            {/* Section Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{activeSectionData.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{activeSectionData.description}</p>
                </div>
                <button
                  onClick={() => navigate(activeSectionData.quizPath)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Practice Quiz <FaExternalLinkAlt className="text-xs" />
                </button>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold">
                <FaRupeeSign /> {activeSectionData.price}/- only
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions by name or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Questions Count */}
            <div className="text-right text-sm text-gray-600 dark:text-gray-400 mb-4">
              Showing {filteredQuestions.length} of {activeSectionData.questionCount} questions
            </div>

            {/* Questions List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question, index) => (
                  <a
                    key={question.id}
                    href={question.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-all hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {question.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="text-gray-600 dark:text-gray-300">{question.topic}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyBgColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                        </div>
                      </div>
                      <FaExternalLinkAlt className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">No questions found matching your criteria</p>
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setSearchTerm('');
                      setDifficultyFilter('all');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DSASheetPage;