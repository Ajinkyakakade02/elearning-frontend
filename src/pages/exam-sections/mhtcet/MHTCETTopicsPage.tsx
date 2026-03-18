import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaBook,
  FaUsers,
  FaStar,
  FaAtom,
  FaFlask,
  FaSquareRootAlt,
  FaDna
} from 'react-icons/fa';

interface MHTCETTopicsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MHTCETTopicsPage: React.FC<MHTCETTopicsPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const subjects = [
    {
      id: 'physics',
      title: 'Physics',
      description: 'Complete Physics for MHT CET with all chapters - Mechanics, Thermodynamics, Optics, Electromagnetism, Modern Physics',
      icon: <FaAtom />,
      color: '#4299e1',
      questionCount: 50,
      timeLimit: 60,
      difficulty: 'Medium',
      attempts: 4500,
      rating: 4.7,
      path: '/quiz/5/topic/mhtcet-physics'
    },
    {
      id: 'chemistry',
      title: 'Chemistry',
      description: 'Complete Chemistry for MHT CET with Physical, Inorganic, and Organic Chemistry',
      icon: <FaFlask />,
      color: '#48bb78',
      questionCount: 50,
      timeLimit: 60,
      difficulty: 'Medium',
      attempts: 4200,
      rating: 4.6,
      path: '/quiz/5/topic/mhtcet-chemistry'
    },
    {
      id: 'mathematics',
      title: 'Mathematics',
      description: 'Complete Mathematics for MHT CET with Algebra, Calculus, Coordinate Geometry, Trigonometry, Probability',
      icon: <FaSquareRootAlt />,
      color: '#ed8936',
      questionCount: 50,
      timeLimit: 60,
      difficulty: 'Medium',
      attempts: 4800,
      rating: 4.8,
      path: '/quiz/5/topic/mhtcet-mathematics'
    },
    {
      id: 'biology',
      title: 'Biology',
      description: 'Complete Biology for MHT CET with Botany, Zoology, Human Physiology, Genetics, and Biotechnology',
      icon: <FaDna />,
      color: '#8b5cf6',
      questionCount: 50,
      timeLimit: 60,
      difficulty: 'Medium',
      attempts: 3900,
      rating: 4.5,
      path: '/quiz/5/topic/mhtcet-biology'
    }
  ];

  // BACK NAVIGATION - to main quiz page
  const handleBack = () => {
    navigate('/quiz', { replace: true });
  };

  // FORWARD NAVIGATION - to specific subject quiz
  const handleSubjectClick = (path: string) => {
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
      case 'easy': return '🌱';
      case 'medium': return '📈';
      case 'hard': return '🚀';
      default: return '📊';
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
        {/* Header with back button */}
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">MHT CET Quiz Series</h1>
          <p className="text-gray-600 dark:text-gray-300">Complete preparation for MHT CET entrance exam with subject-wise quizzes</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{subjects.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Subjects</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {subjects.reduce((sum, s) => sum + s.attempts, 0).toLocaleString()}+
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Total Attempts</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaStar />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {(subjects.reduce((sum, s) => sum + s.rating, 0) / subjects.length).toFixed(1)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <div 
              key={subject.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              onClick={() => handleSubjectClick(subject.path)}
            >
              {/* Subject Header */}
              <div 
                className="p-6 text-center"
                style={{ 
                  background: `linear-gradient(135deg, ${subject.color}20, ${subject.color}40)`
                }}
              >
                <div className="text-5xl mb-3 flex justify-center">
                  {subject.icon}
                </div>
                <div 
                  className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold ${getDifficultyBgColor(subject.difficulty)}`}
                >
                  {getDifficultyIcon(subject.difficulty)} {subject.difficulty}
                </div>
              </div>
              
              {/* Subject Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{subject.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {subject.description}
                </p>
                
                {/* Meta Info - Grid layout for better organization */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FaBook className="text-blue-500" /> {subject.questionCount} questions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FaClock className="text-green-500" /> {subject.timeLimit} min
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FaUsers className="text-orange-500" /> {subject.attempts.toLocaleString()}+
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FaStar className="text-yellow-500" /> {subject.rating}
                  </div>
                </div>

                {/* Start Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 group">
                  Start Quiz
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

export default MHTCETTopicsPage;