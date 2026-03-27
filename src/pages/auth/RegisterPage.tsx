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
  FaLaptopCode,
  FaEye,
  FaEyeSlash
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              onClick={() => navigate('/login')}
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

      {/* ─── Hero Section ─── */}
      <div id="hero" className="login-root relative overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white pt-24 pb-16 px-4">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-orb-1 absolute -top-32 -left-32 w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-400/8 blur-3xl" />
          <div className="animate-orb-2 absolute top-20 right-0 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-400/8 blur-3xl" />
          <div className="animate-orb-1 absolute bottom-0 left-1/2 w-72 h-72 rounded-full bg-pink-500/8 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
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

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <button
                  onClick={() => navigate('/login')}
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

              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start">
                {[
                  { val: stats.students, label: 'Students', icon: <FaUserGraduate /> },
                  { val: stats.courses,  label: 'Courses',  icon: <FaBook /> },
                  { val: stats.quizzes,  label: 'Quizzes',  icon: <FaChartLine /> },
                ].map((s, i) => (
                  <div key={i} className="stat-pill text-center bg-white/70 dark:bg-gray-800/70 rounded-2xl px-5 py-3 shadow-sm">
                    <div className="display-font text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{s.val.toLocaleString()}+</div>
                    <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 text-sm mt-0.5">{s.icon} {s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 animate-fadein" style={{ animationDelay: '0.3s' }}>
              <div className="relative flex justify-center">
                <div className="absolute inset-0 m-auto w-64 h-64 rounded-full bg-indigo-400/15 blur-2xl" />
                <img src={`${process.env.PUBLIC_URL}/images/3d-student.png`} alt="3D Student" className="relative z-10 w-full max-w-lg mx-auto animate-float drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Registration Form ─── */}
      <div id="register-form" className="login-root py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          <div className="login-card rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700/60">
            <h2 className="display-font text-2xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                <FaUser className="text-indigo-600 dark:text-indigo-400 text-sm" />
              </span>
              Create Account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Join our learning community today</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="form-input-focus w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white text-sm placeholder-gray-400 transition-all"
                />
              </div>

              {/* Email Field */}
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

              {/* Password Field with Eye Button */}
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={6}
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

              {/* Confirm Password Field with Eye Button */}
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="form-input-focus w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white text-sm placeholder-gray-400 transition-all"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
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
                      Creating account...
                    </span>
                  ) : (
                    <>Sign Up <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20 text-sm"
                >
                  Login
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
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

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={handleGoogleRegister}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors text-gray-700 dark:text-gray-200 text-sm font-medium"
              >
                <FaGoogle className="text-red-500" /> Google
              </button>
              <button
                onClick={handleGithubRegister}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors text-gray-700 dark:text-gray-200 text-sm font-medium"
              >
                <FaGithub /> GitHub
              </button>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                Sign in <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the sections (App Info, How It Works, Statistics, Popular Courses) remain the same as in the previous code */}
      {/* ... (copy the remaining sections from the previous RegisterPage code) ... */}

    </div>
  );
};

export default RegisterPage;