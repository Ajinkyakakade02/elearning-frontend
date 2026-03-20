import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FaBolt,
  FaHeartbeat,
  FaPen, 
  FaLaptopCode,
  FaBook, 
  FaChartLine, 
  FaUserGraduate, 
  FaArrowRight,
  FaTrophy,
  FaUniversity,
  FaHospital,
  FaLandmark,
  FaClock
} from 'react-icons/fa';

interface DashboardPageProps {
  darkMode?: boolean;
  setDarkMode?: (value: boolean) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [stats, setStats] = useState({ students: 0, courses: 0, quizzes: 0 });

  // Counter animation on load
  useEffect(() => {
    animateStats();
  }, []);

  const animateStats = () => {
    const targets = { students: 50000, courses: 1200, quizzes: 20000 };
    const duration = 2000;
    const steps = 60;
    const increment = {
      students: targets.students / steps,
      courses: targets.courses / steps,
      quizzes: targets.quizzes / steps
    };
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setStats({
        students: Math.min(Math.floor(increment.students * currentStep), targets.students),
        courses: Math.min(Math.floor(increment.courses * currentStep), targets.courses),
        quizzes: Math.min(Math.floor(increment.quizzes * currentStep), targets.quizzes)
      });
      
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);
  };

  const toggleTheme = () => {
    if (setDarkMode) {
      setDarkMode(!darkMode);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Course categories
  const courses = [
    { id: 'jee', title: 'JEE Preparation', icon: <FaBolt />, path: '/jee', color: '#6366f1', students: 15000, lessons: 280 },
    { id: 'neet', title: 'NEET UG', icon: <FaHeartbeat />, path: '/neet', color: '#10b981', students: 18000, lessons: 320 },
    { id: 'upsc', title: 'UPSC CSE', icon: <FaLandmark />, path: '/upsc', color: '#8b5cf6', students: 12000, lessons: 450 },
    { id: 'mhtcet', title: 'MHT-CET', icon: <FaPen />, path: '/mhtcet', color: '#f59e0b', students: 8000, lessons: 180 },
    { id: 'dsa', title: 'DSA', icon: <FaLaptopCode />, path: '/dsa', color: '#ec4899', students: 22000, lessons: 150 }
  ];

  // Quiz categories
  const quizzes = [
    { id: 'quiz1', title: 'JEE Quiz Series', icon: <FaBolt />, path: '/quiz/2', questions: 500, color: '#6366f1' },
    { id: 'quiz2', title: 'NEET Quiz Series', icon: <FaHeartbeat />, path: '/quiz/3', questions: 600, color: '#10b981' },
    { id: 'quiz4', title: 'MHT-CET Quiz Series', icon: <FaPen />, path: '/quiz/5', questions: 400, color: '#f59e0b' },
    { id: 'quiz5', title: 'DSA Quiz Series', icon: <FaLaptopCode />, path: '/quiz/1', questions: 350, color: '#ec4899' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hidden buttons to keep functions "used" - remove if you add actual UI */}
      <button onClick={toggleTheme} className="hidden">Toggle Theme</button>
      <button onClick={handleLogout} className="hidden">Logout</button>

      {/* Hero Section */}
      <div id="hero" className="relative bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white py-12 sm:py-16 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
         
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left Side - Hero Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-sm">
                E-LEARN PLATFORM
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Master JEE, NEET, UPSC,<br />
                MHT-CET & DSA in One<br />
                Powerful Platform
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
                Crack Exams. Build Skills. Achieve Excellence.
              </p>
              
              {/* Stats Section */}
              <div className="flex flex-wrap gap-4 sm:gap-8 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.students.toLocaleString()}+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <FaUserGraduate /> Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.courses.toLocaleString()}+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <FaBook /> Courses
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.quizzes.toLocaleString()}+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <FaChartLine /> Quizzes
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Large Image */}
            <div className="flex-1">
              <div className="relative">
                <img 
                  src={`${process.env.PUBLIC_URL}/images/3d-student.png`} 
                  alt="3D Student" 
                  className="relative z-10 w-3/4 sm:w-2/3 md:w-3/5 lg:w-2/3 xl:w-3/4 max-w-sm sm:max-w-md md:max-w-lg mx-auto animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-white">
          Popular Courses
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {courses.map((course) => (
            <Link 
              to={course.path} 
              key={course.id} 
              className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-xl flex-shrink-0">
                  <span className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300">
                    {course.icon}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white flex-1">
                  {course.title}
                </h3>
              </div>
              
              <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 flex-1">
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <FaUserGraduate className="text-gray-500 dark:text-gray-500 flex-shrink-0" /> 
                  <span>{course.students.toLocaleString()}+ students</span>
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <FaBook className="text-gray-500 dark:text-gray-500 flex-shrink-0" /> 
                  <span>{course.lessons}+ lessons</span>
                </li>
              </ul>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <button className="px-3 sm:px-4 py-1 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  Explore<FaArrowRight className="text-xs sm:text-sm group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* App Info Section - remaining content unchanged but with responsive classes */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left Side - Image */}
            <div className="flex-1">
              <div className="relative">
                <img 
                  src={`${process.env.PUBLIC_URL}/images/3d-student2.png`} 
                  alt="3D Student" 
                  className="relative z-10 w-3/4 sm:w-2/3 md:w-3/5 lg:w-2/3 xl:w-3/4 max-w-sm sm:max-w-md md:max-w-lg mx-auto animate-float"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 space-y-6 sm:space-y-8">
              
              {/* Our Achievers */}
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                  <FaTrophy className="text-yellow-500" /> Our Achievers
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    <FaUniversity className="text-blue-500" /> Students selected in IITs
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    <FaHospital className="text-green-500" /> Students admitted to AIIMS
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    <FaLandmark className="text-purple-500" /> Selections in Government Colleges
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    <FaUserGraduate className="text-orange-500" /> IAS & IPS Officers in the making
                  </li>
                </ul>
              </div>

              {/* Courses Card */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/courses')}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate('/courses');
                  }
                }}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaBook className="text-3xl sm:text-4xl text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">All Courses</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">85+</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">₹99</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Starting Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">24/7</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Access</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                  <button className="px-3 sm:px-4 py-1 sm:py-2 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-white transition-all duration-300 flex items-center gap-2 group">
                    Browse All Courses <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 px-3 sm:px-5 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold">
                    New courses added
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-white">
          Practice Quizzes
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quizzes.map((quiz) => (
            <Link 
              to={quiz.path} 
              key={quiz.id} 
              className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-xl sm:text-2xl text-gray-700 dark:text-gray-300 flex-shrink-0">
                  {quiz.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white flex-1">
                  {quiz.title}
                </h3>
              </div>
              
              <ul className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-1">
                <li className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <FaBook className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm flex-shrink-0" />
                  <span>{quiz.questions}+ questions</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <FaClock className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm flex-shrink-0" />
                  <span>{Math.round(quiz.questions * 0.6)} min estimated</span>
                </li>
              </ul>
              
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <button className="px-3 sm:px-4 py-1 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  Quiz Start <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;