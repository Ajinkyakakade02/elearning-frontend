import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaUsers, 
  FaStar,
  FaBook,
  FaRupeeSign
} from 'react-icons/fa';

interface MHTCETBiologyPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MHTCETBiologyPage: React.FC<MHTCETBiologyPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const courseId = 21; // Hardcode the course ID since we know it's 21 for Biology
  
  const [isLoading, setIsLoading] = useState(true);

  // Mock course data for MHT CET Biology - with ₹99 price
  const course = {
    id: 21,
    title: 'MHT CET Biology Complete',
    description: 'Complete biology syllabus for PCB students: botany, zoology, human physiology, genetics, ecology, biotechnology, and evolution. Covers all topics with diagrams and practice questions.',
    instructorName: 'Dr. Patil',
    level: 'Advanced',
    durationHours: 60,
    totalLessons: 27,
    totalStudents: 9800,
    price: 99,
    rating: 4.7,
    categoryName: 'MHT CET Preparation'
  };

  // Biology sections for display - Like NEET Biology sections
  const biologySections = [
    { 
      id: 'botany', 
      title: 'Botany', 
      description: 'Plant Kingdom, Morphology, Anatomy, Photosynthesis, Plant Growth, Reproduction, Ecology',
      icon: '🌿', 
      color: '#10b981',
      lessonCount: 8,
      duration: '7 hours',
      students: 12450,
      rating: 4.7,
      price: 99,
      topics: [
        'Plant Kingdom',
        'Morphology of Plants',
        'Anatomy of Plants',
        'Photosynthesis',
        'Plant Growth',
        'Reproduction in Plants',
        'Ecology'
      ]
    },
    { 
      id: 'zoology', 
      title: 'Zoology', 
      description: 'Animal Kingdom, Human Physiology, Digestive System, Respiratory System, Circulatory System, Nervous System',
      icon: '🦁', 
      color: '#f59e0b',
      lessonCount: 9,
      duration: '8 hours',
      students: 13600,
      rating: 4.8,
      price: 99,
      topics: [
        'Animal Kingdom',
        'Digestive System',
        'Respiratory System',
        'Circulatory System',
        'Excretory System',
        'Nervous System',
        'Endocrine System'
      ]
    },
    { 
      id: 'biotech-genetics', 
      title: 'Biotechnology & Genetics', 
      description: 'Genetics, Molecular Biology, Biotechnology, Evolution, Ecology, Biodiversity',
      icon: '🧬', 
      color: '#8b5cf6',
      lessonCount: 10,
      duration: '9 hours',
      students: 10800,
      rating: 4.6,
      price: 99,
      topics: [
        'Genetics - Mendelian Inheritance',
        'Chromosomal Basis of Inheritance',
        'DNA Structure & Replication',
        'Transcription & Translation',
        'Biotechnology - Principles',
        'Biotechnology - Applications',
        'Evolution',
        'Ecology',
        'Biodiversity & Conservation'
      ]
    }
  ];

  const totalStudents = biologySections.reduce((sum, s) => sum + s.students, 0);
  const avgRating = (biologySections.reduce((sum, s) => sum + s.rating, 0) / biologySections.length).toFixed(1);
  const totalBundleValue = biologySections.length * 99;

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleBack = () => {
    navigate('/mhtcet');
  };

  const handleSectionClick = (sectionId: string) => {
    console.log('🔍 Section clicked:', sectionId);
    console.log('🔍 Using course ID:', courseId);
    const navigationPath = `/courses/${courseId}/section/${sectionId}`;
    console.log('🔍 Navigating to:', navigationPath);
    navigate(navigationPath);
  };

  const getLevelColor = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLevelIcon = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return '🌱';
      case 'intermediate': return '📈';
      case 'advanced': return '🚀';
      default: return '📚';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading course details...</p>
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
        {/* Back Button */}
        <div className="mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={handleBack}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to MHT CET
          </button>
        </div>

        {/* Course Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{course.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{course.description}</p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <span className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium">
              👨‍🏫 {course.instructorName}
            </span>
            <span 
              className="px-4 py-2 text-white rounded-full text-sm font-medium"
              style={{ backgroundColor: getLevelColor(course.level) }}
            >
              {getLevelIcon(course.level)} {course.level}
            </span>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium flex items-center gap-1">
              <FaRupeeSign /> 99/-
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaBook />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{biologySections.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Sections</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaUsers />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalStudents.toLocaleString()}+</h3>
              <p className="text-gray-600 dark:text-gray-300">Students</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
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
          <span className="font-semibold">All Biology sections at just ₹99/- each! Complete MHT CET Biology for ₹{totalBundleValue}/-</span>
        </div>

        {/* Biology Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {biologySections.map((section) => (
            <div 
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              onClick={() => handleSectionClick(section.id)}
            >
              {/* Section Header */}
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

export default MHTCETBiologyPage;