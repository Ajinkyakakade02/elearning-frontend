import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaBook,
  FaUsers,
  FaStar,
  FaLandmark,
  FaGlobe,
  FaMicrochip,
  FaBalanceScale,
  FaRupeeSign
} from 'react-icons/fa';

interface MainsGSSectionsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MainsGSSectionsPage: React.FC<MainsGSSectionsPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'gs-paper-1',
      title: 'GS Paper I',
      subtitle: 'Indian Heritage, Culture, History & Geography',
      description: 'Indian culture, Modern History, World History, Society, Geography',
      icon: '🏛️',
      color: '#3b82f6',
      lessonCount: 12,
      duration: '16 hours',
      students: 15420,
      rating: 4.8,
      price: 99,
      topics: [
        'Indian Culture & Heritage',
        'Modern Indian History',
        'World History',
        'Indian Society',
        'World & Indian Geography'
      ]
    },
    {
      id: 'gs-paper-2',
      title: 'GS Paper II',
      subtitle: 'Polity, Governance, Social Justice & International Relations',
      description: 'Constitution, Parliament, Federal structure, International Relations',
      icon: '⚖️',
      color: '#10b981',
      lessonCount: 11,
      duration: '15 hours',
      students: 14320,
      rating: 4.9,
      price: 99,
      topics: [
        'Indian Constitution',
        'Parliament & State Legislatures',
        'Federal Structure',
        'Judiciary',
        'International Relations'
      ]
    },
    {
      id: 'gs-paper-3',
      title: 'GS Paper III',
      subtitle: 'Technology, Economy, Environment & Security',
      description: 'Indian Economy, Science & Tech, Biodiversity, Disaster Management, Internal Security',
      icon: '🔬',
      color: '#f59e0b',
      lessonCount: 11,
      duration: '14 hours',
      students: 13200,
      rating: 4.7,
      price: 99,
      topics: [
        'Indian Economy',
        'Science & Technology',
        'Environment & Biodiversity',
        'Disaster Management',
        'Internal Security'
      ]
    },
    {
      id: 'gs-paper-4',
      title: 'GS Paper IV',
      subtitle: 'Ethics, Integrity & Aptitude',
      description: 'Ethics, Attitude, Emotional intelligence, Case studies',
      icon: '🤝',
      color: '#8b5cf6',
      lessonCount: 11,
      duration: '15 hours',
      students: 12500,
      rating: 4.9,
      price: 99,
      topics: [
        'Ethics & Human Values',
        'Attitude & Emotional Intelligence',
        'Moral Thinkers',
        'Probity in Governance',
        'Case Studies'
      ]
    }
  ];

  const totalLessons = sections.reduce((sum, section) => sum + section.lessonCount, 0);
  const totalStudents = sections.reduce((sum, section) => sum + section.students, 0);
  const totalBundleValue = sections.length * 99;

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
            onClick={() => navigate('/courses/13/sections')}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to UPSC Sections
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Mains GS Papers</h1>
          <p className="text-gray-600 dark:text-gray-300">Complete preparation for GS Papers I, II, III, IV - All at ₹99/-</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{sections.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">GS Papers</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalLessons}</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Lessons</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalStudents.toLocaleString()}+</h3>
              <p className="text-gray-600 dark:text-gray-300">Students</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl">
              <span>💰</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">₹ {totalBundleValue}/-</h3>
              <p className="text-gray-600 dark:text-gray-300">Complete Bundle</p>
            </div>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">All Mains GS Papers at just ₹99/- each! Complete UPSC Mains for ₹{totalBundleValue}/-</span>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((section) => (
            <div 
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              onClick={() => navigate(`/courses/13/mains/${section.id}`)}
            >
              {/* Paper Header */}
              <div 
                className="p-6 text-center"
                style={{ 
                  background: `linear-gradient(135deg, ${section.color}20, ${section.color}40)`
                }}
              >
                <span className="text-5xl mb-3 block">
                  {section.icon}
                </span>
                <div 
                  className="inline-block px-4 py-1 rounded-full text-white text-sm font-semibold"
                  style={{ backgroundColor: section.color }}
                >
                  {section.lessonCount} Lessons
                </div>
              </div>
              
              {/* Paper Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{section.title}</h3>
                <p className="text-sm font-medium" style={{ color: section.color, marginBottom: '0.5rem' }}>
                  {section.subtitle}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {section.description}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <FaClock className="text-blue-500" /> {section.duration}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <FaUsers className="text-green-500" /> {section.students.toLocaleString()}+
                  </span>
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <FaStar className="text-yellow-500" /> {section.rating}
                  </span>
                </div>

                {/* Price Tag */}
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold mb-4">
                  <FaRupeeSign /> 99/-
                </div>

                {/* Topics Preview */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {section.topics.slice(0, 3).map((topic, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                    >
                      {topic.length > 20 ? topic.substring(0, 20) + '...' : topic}
                    </span>
                  ))}
                  {section.topics.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                      +{section.topics.length - 3} more
                    </span>
                  )}
                </div>

                {/* Explore Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 group">
                  Explore Paper @ ₹99
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

export default MainsGSSectionsPage;