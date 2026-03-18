import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaBook,
  FaUsers,
  FaStar,
  FaGraduationCap,
  FaChartLine,
  FaGlobe,
  FaBalanceScale,
  FaLeaf,
  FaRupeeSign,
  FaLandmark,
  FaCalculator,
  FaPenFancy,
  FaGavel,
  FaScroll
} from 'react-icons/fa';

interface UPSCTopicsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const UPSCTopicsPage: React.FC<UPSCTopicsPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'prelims-gs',
      title: 'Prelims GS',
      description: 'General Studies Paper I for UPSC Prelims - History, Geography, Polity, Economy, Environment',
      icon: <FaLandmark />,
      color: '#3b82f6',
      lessonCount: 28,
      duration: '35 hours',
      students: 12500,
      rating: 4.8,
      path: '/courses/13/section/prelims-gs',
      price: 99,
      topics: [
        'Indian History',
        'Indian Geography',
        'Indian Polity',
        'Indian Economy',
        'Environment & Ecology',
        'General Science',
        'Current Affairs'
      ]
    },
    {
      id: 'csat',
      title: 'CSAT',
      description: 'Civil Services Aptitude Test - Paper II (Qualifying)',
      icon: <FaCalculator />,
      color: '#f59e0b',
      lessonCount: 12,
      duration: '15 hours',
      students: 11200,
      rating: 4.7,
      path: '/courses/13/section/csat',
      price: 99,
      topics: [
        'Comprehension',
        'Logical Reasoning',
        'Quantitative Aptitude',
        'Data Interpretation',
        'Decision Making',
        'Problem Solving'
      ]
    },
    {
      id: 'mains-gs',
      title: 'Mains GS Papers',
      description: 'GS Papers I, II, III, IV - Complete coverage',
      icon: <FaScroll />,
      color: '#10b981',
      lessonCount: 45,
      duration: '60 hours',
      students: 14200,
      rating: 4.9,
      path: '/courses/13/section/mains-gs',
      price: 99,
      topics: [
        'GS Paper I: Culture, History, Geography',
        'GS Paper II: Polity, Governance, IR',
        'GS Paper III: Economy, Tech, Environment',
        'GS Paper IV: Ethics, Integrity',
        'Case Studies'
      ]
    },
    {
      id: 'ethics',
      title: 'Ethics (GS IV)',
      description: 'Ethics, Integrity & Aptitude - Complete coverage with case studies',
      icon: <FaGavel />,
      color: '#8b5cf6',
      lessonCount: 18,
      duration: '22 hours',
      students: 9800,
      rating: 4.8,
      path: '/courses/13/section/ethics',
      price: 99,
      topics: [
        'Ethics & Human Interface',
        'Attitude & Emotional Intelligence',
        'Aptitude & Foundational Values',
        'Moral Thinkers',
        'Probity in Governance',
        'Case Studies Analysis'
      ]
    },
    {
      id: 'essay-optional',
      title: 'Essay & Optional',
      description: 'Essay writing techniques and Optional subject preparation',
      icon: <FaPenFancy />,
      color: '#ec4899',
      lessonCount: 14,
      duration: '18 hours',
      students: 8600,
      rating: 4.6,
      path: '/courses/13/section/essay-optional',
      price: 99,
      topics: [
        'Essay Writing Techniques',
        'Structure & Flow',
        'Quote Integration',
        'Optional Subject Strategy',
        'Answer Writing Practice',
        'Previous Year Analysis'
      ]
    }
  ];

  // BACK NAVIGATION - to UPSC main page
  const handleBack = () => {
    navigate('/upsc', { replace: true });
  };

  // FORWARD NAVIGATION - to specific section
  const handleSectionClick = (path: string) => {
    navigate(path);
  };

  // Calculate total bundle value
  const totalValue = sections.length * 99;

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
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to UPSC
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">UPSC Civil Services Examination</h1>
          <p className="text-gray-600 dark:text-gray-300">Complete preparation for Prelims, Mains, and Optional papers - All at ₹99/-</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{sections.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Sections</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaGraduationCap />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {sections.reduce((sum, s) => sum + s.lessonCount, 0)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Total Lessons</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {sections.reduce((sum, s) => sum + s.students, 0).toLocaleString()}+
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Students</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl">
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
          <FaLandmark className="text-xl" />
          <span className="font-semibold">All UPSC sections at just ₹99/- each! Limited time offer.</span>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((section) => (
            <div 
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              onClick={() => handleSectionClick(section.path)}
            >
              {/* Section Header */}
              <div 
                className="p-6 text-center"
                style={{ 
                  background: `linear-gradient(135deg, ${section.color}20, ${section.color}40)`
                }}
              >
                <div className="text-5xl mb-3 flex justify-center">
                  {section.icon}
                </div>
                <div 
                  className="inline-block px-4 py-1 rounded-full text-white text-sm font-semibold"
                  style={{ backgroundColor: section.color }}
                >
                  {section.lessonCount} Lessons
                </div>
              </div>
              
              {/* Section Info */}
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
                  {section.topics.slice(0, 4).map((topic, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                    >
                      {topic.length > 20 ? topic.substring(0, 20) + '...' : topic}
                    </span>
                  ))}
                  {section.topics.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                      +{section.topics.length - 4} more
                    </span>
                  )}
                </div>

                {/* Explore Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 group">
                  Explore Section @ ₹99
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

export default UPSCTopicsPage;