import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaBook,
  FaUsers,
  FaStar,
  FaRupeeSign
} from 'react-icons/fa';

interface PrelimsGSSectionsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const PrelimsGSSectionsPage: React.FC<PrelimsGSSectionsPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'indian-history',
      title: 'Indian History',
      description: 'Ancient, Medieval, Modern India & Freedom Struggle',
      icon: '🏛️',
      color: '#3b82f6',
      lessonCount: 10,
      duration: '15 hours',
      students: 15420,
      rating: 4.8,
      price: 99,
      topics: [
        'Ancient India (Indus Valley, Vedic, Mauryan, Gupta)',
        'Medieval India (Delhi Sultanate, Mughals, Marathas)',
        'Modern India (British Expansion, Freedom Struggle)'
      ]
    },
    {
      id: 'indian-geography',
      title: 'Indian Geography',
      description: 'Physical, Climate, Drainage, Agriculture, Resources',
      icon: '⛰️',
      color: '#10b981',
      lessonCount: 5,
      duration: '8 hours',
      students: 12300,
      rating: 4.7,
      price: 99,
      topics: [
        'Physical Features & Climate',
        'Drainage System',
        'Agriculture & Soils',
        'Mineral & Energy Resources'
      ]
    },
    {
      id: 'indian-polity',
      title: 'Indian Polity',
      description: 'Constitution, Fundamental Rights, Parliament, Judiciary',
      icon: '⚖️',
      color: '#8b5cf6',
      lessonCount: 5,
      duration: '7 hours',
      students: 14500,
      rating: 4.9,
      price: 99,
      topics: [
        'Constitutional Framework',
        'Fundamental Rights & Duties',
        'Parliament & State Legislature',
        'Judiciary System'
      ]
    },
    {
      id: 'indian-economy',
      title: 'Indian Economy',
      description: 'Basic Concepts, Banking, Budget, Fiscal Policy',
      icon: '📈',
      color: '#f59e0b',
      lessonCount: 3,
      duration: '5 hours',
      students: 11200,
      rating: 4.6,
      price: 99,
      topics: [
        'Basic Economic Concepts',
        'Banking & Finance',
        'Budget & Fiscal Policy'
      ]
    },
    {
      id: 'environment',
      title: 'Environment',
      description: 'Ecology, Biodiversity, Climate Change, Policies',
      icon: '🌿',
      color: '#14b8a6',
      lessonCount: 3,
      duration: '4 hours',
      students: 10800,
      rating: 4.7,
      price: 99,
      topics: [
        'Ecology & Ecosystem',
        'Biodiversity & Conservation',
        'Climate Change & Policies'
      ]
    },
    {
      id: 'general-science',
      title: 'General Science',
      description: 'Physics, Chemistry, Biology, Technology',
      icon: '🔬',
      color: '#ec4899',
      lessonCount: 2,
      duration: '3 hours',
      students: 9800,
      rating: 4.5,
      price: 99,
      topics: [
        'Physics & Chemistry Basics',
        'Biology & Technology'
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Prelims GS</h1>
          <p className="text-gray-600 dark:text-gray-300">Complete General Studies Paper I preparation for UPSC Prelims - All at ₹99/-</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{sections.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Subjects</p>
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
          <span className="font-semibold">All Prelims GS subjects at just ₹99/- each! Complete UPSC Prelims for ₹{totalBundleValue}/-</span>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((section) => (
            <div 
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              onClick={() => navigate(`/courses/13/subject/${section.id}`)}
            >
              {/* Subject Header */}
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
              
              {/* Subject Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{section.title}</h3>
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
                      {topic.length > 30 ? topic.substring(0, 30) + '...' : topic}
                    </span>
                  ))}
                </div>

                {/* Explore Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 group">
                  Explore Subject @ ₹99
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

export default PrelimsGSSectionsPage;