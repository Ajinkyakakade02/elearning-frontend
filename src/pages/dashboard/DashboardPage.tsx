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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
        courses: Math.min(Math.floor(increment.courses * currentStep), targets.courses),
        quizzes: Math.min(Math.floor(increment.quizzes * currentStep), targets.quizzes),
      });
      if (currentStep >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  // Course categories
  const courses = [
    { id: 'jee', title: 'JEE Preparation', icon: <FaBolt />, path: '/jee', color: '#6366f1', students: 15000, lessons: 280 },
    { id: 'neet', title: 'NEET UG', icon: <FaHeartbeat />, path: '/neet', color: '#10b981', students: 18000, lessons: 320 },
    { id: 'upsc', title: 'UPSC CSE', icon: <FaLandmark />, path: '/upsc', color: '#8b5cf6', students: 12000, lessons: 450 },
    { id: 'mhtcet', title: 'MHT-CET', icon: <FaPen />, path: '/mhtcet', color: '#f59e0b', students: 8000, lessons: 180 },
    { id: 'dsa', title: 'DSA', icon: <FaLaptopCode />, path: '/dsa', color: '#ec4899', students: 22000, lessons: 150 },
  ];

  // Quiz categories
  const quizzes = [
    { id: 'quiz1', title: 'JEE Quiz Series', icon: <FaBolt />, path: '/quiz/2', questions: 500, color: '#6366f1' },
    { id: 'quiz2', title: 'NEET Quiz Series', icon: <FaHeartbeat />, path: '/quiz/3', questions: 600, color: '#10b981' },
    { id: 'quiz4', title: 'MHT-CET Quiz Series', icon: <FaPen />, path: '/quiz/5', questions: 400, color: '#f59e0b' },
    { id: 'quiz5', title: 'DSA Quiz Series', icon: <FaLaptopCode />, path: '/quiz/1', questions: 350, color: '#ec4899' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">

      {/* ─── Inline styles for custom animations ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .dashboard-root { font-family: 'DM Sans', sans-serif; }
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
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.35); }
          70%  { box-shadow: 0 0 0 14px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        @keyframes orb {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33%  { transform: scale(1.08) translate(20px, -15px); }
          66%  { transform: scale(0.94) translate(-12px, 10px); }
        }

        .animate-float   { animation: floatY 4.5s ease-in-out infinite; }
        .animate-orb-1   { animation: orb 8s ease-in-out infinite; }
        .animate-orb-2   { animation: orb 11s ease-in-out infinite reverse; }
        .animate-fadein  { animation: fadeSlideUp 0.7s ease both; }

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
          transform: translateY(-6px) scale(1.025);
          box-shadow: 0 20px 40px -8px rgba(0,0,0,0.14);
        }

        .explore-btn {
          position: relative;
          overflow: hidden;
        }
        .explore-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: currentColor;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .explore-btn:hover::after { opacity: 0.08; }

        .stat-pill {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
        }
        
        .glow-dot {
          animation: pulseRing 2.4s cubic-bezier(.455,.03,.515,.955) infinite;
        }
      `}</style>

      {/* ─── Hero ─── */}
      <div
        id="hero"
        className="dashboard-root relative overflow-hidden bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 md:py-24 px-4"
      >
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-orb-1 absolute -top-32 -left-32 w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-400/8 blur-3xl" />
          <div className="animate-orb-2 absolute top-20 right-0 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-400/8 blur-3xl" />
          <div className="animate-orb-1 absolute bottom-0 left-1/2 w-72 h-72 rounded-full bg-pink-500/8 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            {/* Left */}
            <div
              className="flex-1 text-center lg:text-left animate-fadein"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 rounded-full text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-300 mb-6 tracking-widest uppercase">
                <span className="glow-dot w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                E-LEARN PLATFORM
              </div>

              <h1 className="display-font text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold mb-5 leading-[1.12] text-gray-900 dark:text-white">
                Master JEE, NEET, UPSC,<br />
                MHT-CET &amp; DSA in One<br />
                <span className="shimmer-text">Powerful Platform</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8 font-medium">
                Crack Exams. Build Skills. Achieve Excellence.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start">
                {[
                  { val: stats.students, label: 'Students', icon: <FaUserGraduate /> },
                  { val: stats.courses,  label: 'Courses',  icon: <FaBook /> },
                  { val: stats.quizzes,  label: 'Quizzes',  icon: <FaChartLine /> },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="stat-pill animate-fadein text-center bg-white/70 dark:bg-gray-800/70 rounded-2xl px-5 py-3 shadow-sm"
                    style={{ animationDelay: `${0.2 + i * 0.12}s` }}
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 display-font">
                      {s.val.toLocaleString()}+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                      {s.icon} {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating image */}
            <div className="flex-1 animate-fadein" style={{ animationDelay: '0.35s' }}>
              <div className="relative flex justify-center">
                <div className="absolute inset-0 m-auto w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-indigo-400/15 dark:bg-indigo-500/10 blur-2xl" />
                <img
                  src={`${process.env.PUBLIC_URL}/images/3d-student.png`}
                  alt="3D Student"
                  className="relative z-10 w-3/4 sm:w-2/3 lg:w-2/3 xl:w-3/4 max-w-sm sm:max-w-md animate-float drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Popular Courses ─── */}
      <div className="dashboard-root max-w-7xl mx-auto px-4 py-14 sm:py-20">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="display-font text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Popular Courses
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Hand-picked pathways to your dream career
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
          {courses.map((course, idx) => (
            <Link
              to={course.path}
              key={course.id}
              className="card-hover group bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col h-full border border-gray-100 dark:border-gray-700/60"
              style={{ animationDelay: `${idx * 0.07}s` }}
            >
              {/* Accent top bar */}
              <div className="h-1 rounded-full mb-5 -mx-1 opacity-80" style={{ background: course.color }} />

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2.5 rounded-xl flex-shrink-0 text-white text-lg"
                  style={{ backgroundColor: course.color + '22', color: course.color }}
                >
                  {course.icon}
                </div>
                <h3 className="display-font text-sm sm:text-base font-bold text-gray-800 dark:text-white leading-tight flex-1">
                  {course.title}
                </h3>
              </div>

              <ul className="space-y-2 mb-4 flex-1">
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <FaUserGraduate className="flex-shrink-0" style={{ color: course.color }} />
                  <span>{course.students.toLocaleString()}+ students</span>
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <FaBook className="flex-shrink-0" style={{ color: course.color }} />
                  <span>{course.lessons}+ lessons</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 mt-auto">
                <button
                  className="explore-btn w-full px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-2 transition-colors duration-200"
                  style={{
                    borderColor: course.color,
                    color: course.color,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = course.color;
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = course.color;
                  }}
                >
                  Explore <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── App Info Section ─── */}
      <div className="dashboard-root bg-white dark:bg-gray-800/40 py-14 sm:py-20 border-y border-gray-100 dark:border-gray-700/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

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
            <div className="flex-1 space-y-5 sm:space-y-6">

              {/* Achievers */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 dark:border-gray-700/60">
                <h3 className="display-font text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                  <FaTrophy className="text-yellow-400" /> Our Achievers
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: <FaUniversity className="text-blue-500" />,   text: 'Students selected in IITs' },
                    { icon: <FaHospital className="text-green-500" />,    text: 'Students admitted to AIIMS' },
                    { icon: <FaLandmark className="text-purple-500" />,   text: 'Selections in Government Colleges' },
                    { icon: <FaUserGraduate className="text-orange-500" />,text: 'IAS & IPS Officers in the making' },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700/50 rounded-xl px-3 py-2 shadow-sm"
                    >
                      <span className="text-base">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* All Courses card */}
              <div
                className="card-hover bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md cursor-pointer border border-gray-100 dark:border-gray-700/60"
                onClick={() => navigate('/courses')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') navigate('/courses');
                }}
              >
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                      <FaBook className="text-2xl sm:text-3xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="display-font text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">All Courses</h3>
                  </div>
                  <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 dark:border-yellow-700/40">
                    New courses added
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { val: '85+', label: 'Total Courses' },
                    { val: 'Free', label: 'Starting Price' },
                    { val: '24/7', label: 'Access' },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="text-center bg-white dark:bg-gray-700/50 rounded-xl py-3 shadow-sm"
                    >
                      <div className="display-font text-xl sm:text-2xl font-extrabold text-gray-800 dark:text-white">{s.val}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>

                <button className="explore-btn px-4 py-2 border-2 border-green-500 text-green-600 dark:text-green-400 rounded-xl text-sm font-semibold flex items-center gap-2 group hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-white transition-colors">
                  Browse All Courses <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Practice Quizzes ─── */}
      <div className="dashboard-root max-w-7xl mx-auto px-4 py-14 sm:py-20">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="display-font text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Practice Quizzes
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Sharpen your skills with targeted question banks
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {quizzes.map((quiz, idx) => (
            <Link
              to={quiz.path}
              key={quiz.id}
              className="card-hover group bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col h-full border border-gray-100 dark:border-gray-700/60"
              style={{ animationDelay: `${idx * 0.07}s` }}
            >
              <div className="h-1 rounded-full mb-5 -mx-1 opacity-80" style={{ background: quiz.color }} />

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                  style={{ backgroundColor: quiz.color + '20', color: quiz.color }}
                >
                  {quiz.icon}
                </div>
                <h3 className="display-font text-sm sm:text-base font-bold text-gray-800 dark:text-white flex-1 leading-tight">
                  {quiz.title}
                </h3>
              </div>

              <ul className="space-y-2 mb-4 flex-1">
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <FaBook className="flex-shrink-0" style={{ color: quiz.color }} />
                  <span>{quiz.questions}+ questions</span>
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <FaClock className="flex-shrink-0" style={{ color: quiz.color }} />
                  <span>{Math.round(quiz.questions * 0.6)} min estimated</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 mt-auto">
                <button
                  className="w-full px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-2 transition-colors duration-200"
                  style={{ borderColor: quiz.color, color: quiz.color }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = quiz.color;
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = quiz.color;
                  }}
                >
                  Quiz Start <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
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