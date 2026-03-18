import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaFlask, 
  FaDna, 
  FaLeaf,
  FaClock,
  FaBook,
  FaUsers,
  FaStar,
  FaRupeeSign,
  FaBolt,
  FaVial
} from 'react-icons/fa';

interface NEETChemistrySectionsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const NEETChemistrySectionsPage: React.FC<NEETChemistrySectionsPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'physical-chemistry',
      title: 'Physical Chemistry',
      description: 'Periodic Table, Chemical Bonding, Coordination Compounds, d & f Blocks, p-Block, Salt Analysis',
      icon: <FaBolt />,
      color: '#3b82f6',
      lessonCount: 6,
      duration: '15 hours',
      students: 12450,
      rating: 4.8,
      price: 99,
      topics: [
        'Periodic Table',
        'Chemical Bonding',
        'Coordination Compounds',
        'd & f Block Elements',
        'p-Block Elements',
        'Salt Analysis'
      ]
    },
    {
      id: 'inorganic-chemistry',
      title: 'Inorganic Chemistry',
      description: 'IUPAC Naming, Isomerism, GOC, Hydrocarbons, Haloalkanes, Alcohols, Amines, Aldehydes',
      icon: <FaVial />,
      color: '#10b981',
      lessonCount: 9,
      duration: '19 hours',
      students: 11320,
      rating: 4.7,
      price: 99,
      topics: [
        'IUPAC Naming',
        'Isomerism',
        'GOC',
        'Hydrocarbons',
        'Haloalkanes',
        'Alcohols & Phenols',
        'Amines',
        'Aldehydes & Ketones'
      ]
    },
    {
      id: 'organic-chemistry',
      title: 'Organic Chemistry',
      description: 'IUPAC, Isomerism, GOC, Hydrocarbons, Haloalkanes, Alcohols, Amines, Aldehydes',
      icon: <FaLeaf />,
      color: '#8b5cf6',
      lessonCount: 9,
      duration: '18 hours',
      students: 14250,
      rating: 4.9,
      price: 99,
      topics: [
        'IUPAC Naming',
        'Isomerism',
        'GOC',
        'Hydrocarbons',
        'Haloalkanes',
        'Alcohols & Phenols',
        'Amines',
        'Aldehydes & Ketones'
      ]
    }
  ];

  const totalStudents = sections.reduce((sum, section) => sum + section.students, 0);
  const avgRating = (sections.reduce((sum, section) => sum + section.rating, 0) / sections.length).toFixed(1);
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
            onClick={() => navigate('/neet')}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to NEET
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">NEET Chemistry</h1>
          <p className="text-gray-600 dark:text-gray-300">Complete Chemistry preparation with three comprehensive sections - All at ₹99/-</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{sections.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Sections</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalStudents.toLocaleString()}+</h3>
              <p className="text-gray-600 dark:text-gray-300">Students</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaRupeeSign />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">₹ {totalBundleValue}/-</h3>
              <p className="text-gray-600 dark:text-gray-300">Complete Bundle</p>
            </div>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
          <FaLeaf className="text-xl" />
          <span className="font-semibold">All Chemistry sections at just ₹99/- each! Complete NEET Chemistry for ₹{totalBundleValue}/-</span>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div 
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              onClick={() => navigate(`/courses/12/section/${section.id}`)}
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

export default NEETChemistrySectionsPage;