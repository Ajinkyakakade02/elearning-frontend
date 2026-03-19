import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { 
  FaBook, 
  FaGraduationCap, 
  FaChartLine, 
  FaUserGraduate, 
  FaSun,
  FaMoon,
  FaLock,
  FaEnvelope,
  FaArrowRight,
  FaCheckCircle,
  FaTrophy,
  FaUniversity,
  FaHospital,
  FaLandmark,
  FaShieldAlt,
  FaRocket,
  FaPlayCircle,
  FaChartBar,
  FaGoogle,
  FaGithub,
  FaBolt,
  FaHeartbeat,
  FaPen,
  FaLaptopCode
} from 'react-icons/fa';

interface LoginPageProps {
  darkMode?: boolean;
  setDarkMode?: (value: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email || !password) {
    toast.error('Please fill in all fields');
    return;
  }
  
  setIsLoading(true);
  try {
    console.log('🔐 Login attempt started for:', email);
    await login({ email, password });
    console.log('✅ Login successful, navigating to dashboard');
    toast.success('Logged in successfully!');
    navigate('/dashboard');
  } catch (error: any) {
    console.error('❌ Login error in component:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status
    });
    toast.error(error.message || 'Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleGoogleLogin = () => {
    toast.success('Google login coming soon!');
  };

  const handleGithubLogin = () => {
    toast.success('GitHub login coming soon!');
  };

  const toggleTheme = () => {
    if (setDarkMode) {
      setDarkMode(!darkMode);
    }
  };

  const handleNavClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLogin = () => {
    document.getElementById('login-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <FaBook className="text-3xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              E-LEARN
            </span>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
              PRO
            </span>
          </div>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {['hero', 'guide', 'statistics', 'courses'].map((section) => (
              <button
                key={section}
                onClick={() => handleNavClick(section)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 capitalize transition-colors"
              >
                {section}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('login-form')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => handleNavClick('register')}
              className="px-4 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              Sign Up
            </button>
          </div>

          {/* Theme Toggle */}
          {setDarkMode && (
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div id="hero" className="relative bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 dark:bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 dark:bg-blue-500 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left Side - Hero Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold mb-6">
                E-LEARN PLATFORM
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Master JEE, NEET, UPSC,<br />
                MHT-CET & DSA in One<br />
                Powerful Platform
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Crack Exams. Build Skills. Achieve Excellence.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <button
                  onClick={() => handleNavClick('login-form')}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 group"
                >
                  Sign In <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleNavClick('guide')}
                  className="px-8 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all flex items-center gap-2 group"
                >
                  Learn More <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.students.toLocaleString()}+
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <FaUserGraduate /> Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.courses.toLocaleString()}+
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <FaBook /> Courses
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.quizzes.toLocaleString()}+
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
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
                  className="relative z-10 w-full max-w-lg mx-auto animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div id="login-form" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaLock className="text-blue-600 dark:text-blue-400" /> Welcome Back
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
                />
              </div>
              
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <FaCheckCircle className="text-blue-600 dark:text-blue-400" /> Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'} 
                {!isLoading && <FaArrowRight className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {/* Social Login Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={handleGoogleLogin} 
                className="flex items-center justify-center gap-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                disabled={isLoading}
              >
                <FaGoogle className="text-red-500" />
                <span>Google</span>
              </button>
              <button 
                onClick={handleGithubLogin} 
                className="flex items-center justify-center gap-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                disabled={isLoading}
              >
                <FaGithub />
                <span>GitHub</span>
              </button>
            </div>
            
            {/* Create account link */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              New to E-LEARN?{' '}
              <button 
                onClick={scrollToLogin} 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                Create an account <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App Info Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left Side - Image */}
            <div className="flex-1">
              <div className="relative">
                <img 
                  src={`${process.env.PUBLIC_URL}/images/3d-student2.png`} 
                  alt="3D Student" 
                  className="relative z-10 w-full max-w-lg mx-auto"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 space-y-8">
              
              {/* Our Achievers */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                  <FaTrophy className="text-yellow-500" /> Our Achievers
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FaUniversity className="text-blue-500" /> Students selected in IITs
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FaHospital className="text-green-500" /> Students admitted to AIIMS
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FaLandmark className="text-purple-500" /> Selections in Government Colleges
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FaUserGraduate className="text-orange-500" /> IAS & IPS Officers in the making
                  </li>
                </ul>
              </div>

              {/* Why Login Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                  <FaChartLine className="text-green-500" /> Why Login?
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">50,000+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Active Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">1,200+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Structured Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">20,000+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Exam Questions</div>
                  </div>
                </div>
              </div>

              {/* Motivation Quote */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                <FaRocket className="text-3xl mb-2" />
                <p className="text-lg font-medium italic">
                  "Your rank starts with today's login."
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <FaShieldAlt className="text-4xl text-blue-600 dark:text-blue-400" />
                <div>
                  <strong className="block text-gray-800 dark:text-white">Secure & Trusted</strong>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Secure login • Encrypted data • Private dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <div id="guide" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaUserGraduate />, title: 'Create Account', desc: 'Sign up for free and access all courses' },
              { icon: <FaBook />, title: 'Choose Course', desc: 'Select from 1,200+ structured courses' },
              { icon: <FaPlayCircle />, title: 'Start Learning', desc: 'Watch videos, take quizzes, track progress' },
              { icon: <FaTrophy />, title: 'Achieve Goals', desc: 'Crack exams and build your career' }
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="text-4xl text-blue-600 dark:text-blue-400 mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div id="statistics" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Our Impact</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaUserGraduate />, number: '50,000+', label: 'Active Learners' },
              { icon: <FaBook />, number: '1,200+', label: 'Expert Courses' },
              { icon: <FaChartLine />, number: '20,000+', label: 'Practice Questions' },
              { icon: <FaTrophy />, number: '15,000+', label: 'Success Stories' }
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="text-4xl text-blue-600 dark:text-blue-400 mb-3">{item.icon}</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{item.number}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div id="courses" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Popular Courses</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { to: '/jee', icon: <FaBolt className="text-xl" />, title: 'JEE Preparation', desc: 'IIT JEE Main & Advanced' },
              { to: '/neet', icon: <FaHeartbeat className="text-xl" />, title: 'NEET UG', desc: 'Medical Entrance Exam' },
              { to: '/upsc', icon: <FaLandmark className="text-xl" />, title: 'UPSC CSE', desc: 'Civil Services Exam' },
              { to: '/mhtcet', icon: <FaPen className="text-xl" />, title: 'MHT-CET', desc: 'Maharashtra CET' },
              { to: '/dsa', icon: <FaLaptopCode className="text-xl" />, title: 'DSA', desc: 'Data Structures & Algorithms' }
            ].map((course, index) => (
              <Link
                key={index}
                to={course.to}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="text-3xl text-blue-600 dark:text-blue-400 mb-3">{course.icon}</div>
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-white">{course.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{course.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Register Section */}
      <div id="register" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Ready to Begin?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Side - Continue Your Journey Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl">
                  <FaRocket className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Continue Your Journey</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <FaPlayCircle className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Resume your last quiz</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Continue where you stopped</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <FaChartBar className="text-purple-600 dark:text-purple-400 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Track your progress</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your learning journey</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <FaLock className="text-yellow-600 dark:text-yellow-400 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Access premium courses</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Unlock all courses at ₹99/-</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Call to Action Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl">
                  <FaGraduationCap className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Start Learning Today</h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Join 50,000+ students and start preparing for your dream career
                </p>

                {/* Stats Preview */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">50k+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Students</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">1.2k+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Courses</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">20k+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Quizzes</div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FaCheckCircle className="text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FaCheckCircle className="text-green-500" />
                    <span>Start learning in minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FaCheckCircle className="text-green-500" />
                    <span>All courses at just ₹99/-</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button 
                  onClick={scrollToLogin}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group"
                >
                  Create Free Account <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;