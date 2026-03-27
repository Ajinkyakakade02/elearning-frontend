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
  FaLaptopCode,
  FaUsers,
  FaStar,
  FaEye,
  FaEyeSlash
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
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState({ students: 0, courses: 0, quizzes: 0 });

  // Counter animation on load — fixed: cleanup interval on unmount
  useEffect(() => {
    const targets = { students: 50000, courses: 1200, quizzes: 20000 };
    const duration = 2000;
    const steps = 60;
    const increment = {
      students: targets.students / steps,
      courses: targets.courses / steps,
      quizzes: targets.quizzes / steps,
    };
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setStats({
        students: Math.min(Math.floor(increment.students * currentStep), targets.students),
        courses:  Math.min(Math.floor(increment.courses  * currentStep), targets.courses),
        quizzes:  Math.min(Math.floor(increment.quizzes  * currentStep), targets.quizzes),
      });
      if (currentStep >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

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
        status: error.response?.status,
      });
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => { toast.success('Google login coming soon!'); };
  const handleGithubLogin = () => { toast.success('GitHub login coming soon!'); };

  const toggleTheme = () => { if (setDarkMode) setDarkMode(!darkMode); };

  const handleNavClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Stats cards data
  const statsCards = [
    { icon: <FaUserGraduate />, number: '50,000+', label: 'Active Learners',     color: '#3b82f6' },
    { icon: <FaBook />,         number: '1,200+',  label: 'Expert Courses',       color: '#10b981' },
    { icon: <FaChartLine />,    number: '20,000+', label: 'Practice Questions',   color: '#f59e0b' },
    { icon: <FaTrophy />,       number: '15,000+', label: 'Success Stories',      color: '#ef4444' },
  ];

  // Popular courses data with colors and icons matching dashboard
  const popularCourses = [
    { to: '/jee',    icon: <FaBolt className="text-xl" />,      title: 'JEE Preparation',           desc: 'IIT JEE Main & Advanced',         color: '#6366f1' },
    { to: '/neet',   icon: <FaHeartbeat className="text-xl" />, title: 'NEET UG',                   desc: 'Medical Entrance Exam',           color: '#10b981' },
    { to: '/upsc',   icon: <FaLandmark className="text-xl" />,  title: 'UPSC CSE',                  desc: 'Civil Services Exam',             color: '#8b5cf6' },
    { to: '/mhtcet', icon: <FaPen className="text-xl" />,       title: 'MHT-CET',                   desc: 'Maharashtra CET',                 color: '#f59e0b' },
    { to: '/dsa',    icon: <FaLaptopCode className="text-xl" />,title: 'DSA',                       desc: 'Data Structures & Algorithms',    color: '#ec4899' },
  ];

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* ─── Inline styles ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .login-root { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Outfit', sans-serif; }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orb {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33%  { transform: scale(1.08) translate(20px, -15px); }
          66%  { transform: scale(0.94) translate(-12px, 10px); }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          70%  { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }

        .animate-float    { animation: floatY 4.5s ease-in-out infinite; }
        .animate-orb-1    { animation: orb 8s ease-in-out infinite; }
        .animate-orb-2    { animation: orb 11s ease-in-out infinite reverse; }
        .animate-fadein   { animation: fadeSlideUp 0.7s ease both; }
        .glow-dot         { animation: pulseRing 2.4s cubic-bezier(.455,.03,.515,.955) infinite; }

        .shimmer-text {
          background: linear-gradient(90deg, #6366f1 0%, #a78bfa 40%, #ec4899 60%, #6366f1 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .card-hover {
          transition: transform 0.28s cubic-bezier(.34,1.56,.64,1), box-shadow 0.28s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 40px -8px rgba(0,0,0,0.13);
        }

        .form-input-focus:focus {
          outline: none;
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }

        .login-card {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px);
        }
        .dark .login-card {
          background: rgba(31,41,55,0.97);
        }

        .stat-pill {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
        }
      `}</style>

      {/* ─── Navbar ─── */}
      <nav className="login-root fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-sm z-50 border-b border-gray-100 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <FaBook className="text-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="display-font text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              E-LEARN
            </span>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-0.5 rounded-full font-bold tracking-wide">
              PRO
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-5">
            {['hero', 'guide', 'statistics', 'courses'].map((section) => (
              <button
                key={section}
                onClick={() => handleNavClick(section)}
                className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 capitalize text-sm font-medium transition-colors"
              >
                {section}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('login-form')}
              className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-1.5 border border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            >
              Sign Up
            </button>
          </div>

          {/* Theme toggle */}
          {setDarkMode && (
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>
          )}
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <div id="hero" className="login-root relative overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white pt-24 pb-16 px-4">
        {/* Orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-orb-1 absolute -top-32 -left-32 w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-400/8 blur-3xl" />
          <div className="animate-orb-2 absolute top-20 right-0 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-400/8 blur-3xl" />
          <div className="animate-orb-1 absolute bottom-0 left-1/2 w-72 h-72 rounded-full bg-pink-500/8 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Left */}
            <div className="flex-1 text-center lg:text-left animate-fadein">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 rounded-full text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-300 mb-6 tracking-widest uppercase">
                <span className="glow-dot w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                E-LEARN PLATFORM
              </div>

              <h1 className="display-font text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.1] text-gray-900 dark:text-white">
                Master JEE, NEET, UPSC,<br />
                MHT-CET &amp; DSA in One<br />
                <span className="shimmer-text">Powerful Platform</span>
              </h1>

              <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 font-medium">
                Crack Exams. Build Skills. Achieve Excellence.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <button
                  onClick={() => handleNavClick('login-form')}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 group shadow-lg shadow-indigo-500/20"
                >
                  Sign In <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleNavClick('guide')}
                  className="px-8 py-3 border-2 border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all flex items-center gap-2 group"
                >
                  Learn More <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start">
                {[
                  { val: stats.students, label: 'Students', icon: <FaUserGraduate /> },
                  { val: stats.courses,  label: 'Courses',  icon: <FaBook /> },
                  { val: stats.quizzes,  label: 'Quizzes',  icon: <FaChartLine /> },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="stat-pill text-center bg-white/70 dark:bg-gray-800/70 rounded-2xl px-5 py-3 shadow-sm"
                  >
                    <div className="display-font text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                      {s.val.toLocaleString()}+
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 text-sm mt-0.5">
                      {s.icon} {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="flex-1 animate-fadein" style={{ animationDelay: '0.3s' }}>
              <div className="relative flex justify-center">
                <div className="absolute inset-0 m-auto w-64 h-64 rounded-full bg-indigo-400/15 blur-2xl" />
                <img
                  src={`${process.env.PUBLIC_URL}/images/3d-student.png`}
                  alt="3D Student"
                  className="relative z-10 w-full max-w-lg mx-auto animate-float drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Login Form ─── */}
      <div id="login-form" className="login-root py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          <div className="login-card rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700/60">

            <h2 className="display-font text-2xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                <FaLock className="text-indigo-600 dark:text-indigo-400 text-sm" />
              </span>
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign in to continue your learning journey</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="form-input-focus w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white text-sm placeholder-gray-400 transition-all"
                />
              </div>

              {/* Password field with eye toggle */}
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="form-input-focus w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white text-sm placeholder-gray-400 transition-all"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <FaCheckCircle className="text-indigo-500" /> Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 text-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    <>Login <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20 text-sm"
                >
                  Sign Up <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-400 font-medium tracking-widest uppercase">OR</span>
              </div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors text-gray-700 dark:text-gray-200 text-sm font-medium"
              >
                <FaGoogle className="text-red-500" /> Google
              </button>
              <button
                onClick={handleGithubLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors text-gray-700 dark:text-gray-200 text-sm font-medium"
              >
                <FaGithub /> GitHub
              </button>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              New to E-LEARN?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                Create an account <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Statistics ─── */}
      <div id="statistics" className="login-root py-16 px-4 bg-white dark:bg-gray-800/40 border-y border-gray-100 dark:border-gray-700/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display-font text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Our Impact</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Numbers that speak for themselves</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((item, index) => (
              <div
                key={index}
                className="card-hover bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center border-t-4 border border-gray-100 dark:border-gray-700/60"
                style={{ borderTopColor: item.color }}
              >
                <div className="text-4xl mb-4 mx-auto w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: item.color + '18', color: item.color }}>
                  {item.icon}
                </div>
                <div className="display-font text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{item.number}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Popular Courses ─── */}
      <div id="courses" className="login-root py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display-font text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Popular Courses</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Choose your path to success</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {popularCourses.map((course, index) => (
              <Link
                key={index}
                to={course.to}
                className="card-hover group bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center border border-gray-100 dark:border-gray-700/60 flex flex-col items-center"
              >
                <div
                  className="h-1 w-12 rounded-full mb-5 opacity-80"
                  style={{ background: course.color }}
                />
                <div
                  className="text-3xl mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: course.color + '18', color: course.color }}
                >
                  {course.icon}
                </div>
                <h3 className="display-font font-bold text-base mb-1 text-gray-800 dark:text-white">{course.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{course.desc}</p>
                <div
                  className="mt-auto px-4 py-1.5 text-xs font-bold text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ backgroundColor: course.color }}
                >
                  Explore
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── App Info ─── */}
      <div className="login-root bg-white dark:bg-gray-800/40 py-16 px-4 border-y border-gray-100 dark:border-gray-700/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Image */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 m-auto w-56 h-56 rounded-full bg-purple-400/15 blur-2xl" />
                <img
                  src={`${process.env.PUBLIC_URL}/images/3d-student2.png`}
                  alt="3D Student"
                  className="relative z-10 w-full max-w-lg mx-auto animate-float drop-shadow-xl"
                />
              </div>
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-5">

              {/* Achievers */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700/60">
                <h3 className="display-font text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                  <FaTrophy className="text-yellow-400" /> Our Achievers
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: <FaUniversity className="text-blue-500" />,    text: 'Students selected in IITs' },
                    { icon: <FaHospital className="text-green-500" />,     text: 'Students admitted to AIIMS' },
                    { icon: <FaLandmark className="text-purple-500" />,    text: 'Selections in Government Colleges' },
                    { icon: <FaUserGraduate className="text-orange-500" />,text: 'IAS & IPS Officers in the making' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700/50 rounded-xl px-3 py-2 shadow-sm text-sm">
                      <span>{item.icon}</span> {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why Login? */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700/60">
                <h3 className="display-font text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                  <FaChartLine className="text-green-500" /> Why Login?
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { val: '50,000+', label: 'Active Students' },
                    { val: '1,200+',  label: 'Structured Courses' },
                    { val: '20,000+', label: 'Exam Questions' },
                  ].map((s, i) => (
                    <div key={i} className="text-center bg-white dark:bg-gray-700/50 rounded-xl py-3 shadow-sm">
                      <div className="display-font text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{s.val}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivation quote */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                <FaRocket className="text-2xl mb-2 opacity-80" />
                <p className="display-font text-lg font-bold italic">
                  "Your rank starts with today's login."
                </p>
              </div>

              {/* Security badge */}
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700/60">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex-shrink-0">
                  <FaShieldAlt className="text-2xl text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <strong className="block text-gray-800 dark:text-white text-sm font-bold">Secure &amp; Trusted</strong>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Secure login • Encrypted data • Private dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── How It Works ─── */}
      <div id="guide" className="login-root py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display-font text-3xl font-extrabold text-gray-900 dark:text-white mb-2">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Four simple steps to your success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaUserGraduate />, title: 'Create Account', desc: 'Sign up for free and access all courses', color: '#6366f1', step: '01' },
              { icon: <FaBook />,         title: 'Choose Course',  desc: 'Select from 1,200+ structured courses',  color: '#10b981', step: '02' },
              { icon: <FaPlayCircle />,   title: 'Start Learning', desc: 'Watch videos, take quizzes, track progress', color: '#f59e0b', step: '03' },
              { icon: <FaTrophy />,       title: 'Achieve Goals',  desc: 'Crack exams and build your career',       color: '#ec4899', step: '04' },
            ].map((item, index) => (
              <div
                key={index}
                className="card-hover bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center border border-gray-100 dark:border-gray-700/60 relative overflow-hidden"
              >
                <div className="display-font absolute top-3 right-4 text-5xl font-extrabold opacity-5 text-gray-900 dark:text-white select-none">
                  {item.step}
                </div>
                <div
                  className="text-3xl mb-4 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ backgroundColor: item.color + '18', color: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="display-font text-base font-bold mb-2 text-gray-800 dark:text-white">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Register / CTA ─── */}
      <div id="register" className="login-root py-16 px-4 bg-white dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-700/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display-font text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Ready to Begin?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Join thousands already on their path to success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Continue Your Journey */}
            <div className="card-hover bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700/60">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                  <FaRocket className="text-xl text-white" />
                </div>
                <h3 className="display-font text-xl font-bold text-gray-800 dark:text-white">Continue Your Journey</h3>
              </div>

              <div className="space-y-3">
                {[
                  { icon: <FaPlayCircle className="text-green-500 text-lg" />,  bg: 'bg-green-50 dark:bg-green-900/20',  title: 'Resume your last quiz',    sub: 'Continue where you stopped' },
                  { icon: <FaChartBar className="text-purple-500 text-lg" />,   bg: 'bg-purple-50 dark:bg-purple-900/20', title: 'Track your progress',      sub: 'Monitor your learning journey' },
                  { icon: <FaLock className="text-yellow-500 text-lg" />,       bg: 'bg-yellow-50 dark:bg-yellow-900/20', title: 'Access premium courses',   sub: 'Unlock all courses at FREE' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white dark:bg-gray-700/50 rounded-xl shadow-sm">
                    <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Learning Today */}
            <div className="card-hover bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700/60">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                  <FaGraduationCap className="text-xl text-white" />
                </div>
                <h3 className="display-font text-xl font-bold text-gray-800 dark:text-white">Start Learning Today</h3>
              </div>

              <div className="space-y-5">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Join 50,000+ students and start preparing for your dream career
                </p>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { val: '50k+', label: 'Students' },
                    { val: '1.2k+', label: 'Courses' },
                    { val: '20k+', label: 'Quizzes' },
                  ].map((s, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-gray-700/50 rounded-xl shadow-sm">
                      <div className="display-font text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{s.val}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {[
                    'No credit card required',
                    'Start learning in minutes',
                    'All courses at just FREE',
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/register')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20 text-sm"
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