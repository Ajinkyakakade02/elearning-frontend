import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { 
  FaBook, 
  FaChartLine, 
  FaUserGraduate, 
  FaSun,
  FaMoon,
  FaLock,
  FaEnvelope,
  FaUser,
  FaArrowRight,
  FaTrophy,
  FaUniversity,
  FaHospital,
  FaLandmark,
  FaShieldAlt,
  FaRocket,
  FaPlayCircle,
  FaGoogle,
  FaGithub,
  FaBolt,
  FaHeartbeat,
  FaPen,
  FaLaptopCode
} from 'react-icons/fa';

interface RegisterPageProps {
  darkMode?: boolean;
  setDarkMode?: (value: boolean) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ students: 50000, courses: 1200, quizzes: 20000 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      await register({ fullName, email, password });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    toast.success('Google sign up coming soon!');
  };

  const handleGithubRegister = () => {
    toast.success('GitHub sign up coming soon!');
  };

  const toggleTheme = () => {
    if (setDarkMode) {
      setDarkMode(!darkMode);
    }
  };

  const handleNavClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar - Same as Login Page */}
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
          
          {/* Nav Links - Same as Login Page */}
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
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
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

      {/* Hero Section - Same as Login Page */}
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
                  onClick={() => navigate('/login')}
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

      {/* Registration Form Section */}
      <div id="register-form" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaUser className="text-blue-600 dark:text-blue-400" /> Create Account
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
                />
              </div>
              
              {/* Email Field */}
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
              
              {/* Password Field */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
                />
              </div>
              
              {/* Confirm Password Field */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-800 dark:text-white"
                />
              </div>
              
              {/* Two Buttons Side by Side - Same as Login Page */}
              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : (
                    <>
                      Sign Up <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group"
                >
                  Login
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
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
                onClick={handleGoogleRegister} 
                className="flex items-center justify-center gap-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                disabled={isLoading}
              >
                <FaGoogle className="text-red-500" />
                <span>Google</span>
              </button>
              <button 
                onClick={handleGithubRegister} 
                className="flex items-center justify-center gap-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                disabled={isLoading}
              >
                <FaGithub />
                <span>GitHub</span>
              </button>
            </div>
            
            {/* Switch to Login */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                Sign in <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App Info Section - Same as Login Page */}
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

              {/* Why Register Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                  <FaChartLine className="text-green-500" /> Why Join?
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
                  "Start your journey to success today."
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <FaShieldAlt className="text-4xl text-blue-600 dark:text-blue-400" />
                <div>
                  <strong className="block text-gray-800 dark:text-white">Secure & Trusted</strong>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Your data is safe • Privacy protected</span>
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
    </div>
  );
};

export default RegisterPage;