import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaCode, 
  FaArrowLeft, 
  FaBook,
  FaUsers,
  FaStar,
  FaClock,
  FaRupeeSign,
  FaLaptopCode,
  FaArrowRight
} from 'react-icons/fa';

interface DSAPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const DSAPage: React.FC<DSAPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const dsaTopics = [
    {
      id: 'arrays',
      title: 'Arrays & Strings',
      description: 'Master array manipulation, searching, sorting, two-pointer technique, sliding window, and string algorithms.',
      icon: '📊',
      color: '#4299e1',
      lessonCount: 10,
      duration: '15 hours',
      students: 15000,
      rating: 4.8,
      price: 99,
      path: '/dsa/topic/arrays'
    },
    {
      id: 'linkedlist',
      title: 'Linked Lists',
      description: 'Complete linked list problems including singly linked lists, doubly linked lists, circular lists, and advanced operations.',
      icon: '🔗',
      color: '#48bb78',
      lessonCount: 10,
      duration: '12 hours',
      students: 12000,
      rating: 4.7,
      price: 99,
      path: '/dsa/topic/linkedlist'
    },
    {
      id: 'stack-queue',
      title: 'Stacks & Queues',
      description: 'Master stack and queue data structures, implementation, and problem-solving techniques.',
      icon: '📚',
      color: '#ed8936',
      lessonCount: 10,
      duration: '10 hours',
      students: 10000,
      rating: 4.6,
      price: 99,
      path: '/dsa/topic/stack-queue'
    },
    {
      id: 'trees-graphs',
      title: 'Trees & Graphs',
      description: 'Complete tree and graph algorithms including BST, AVL, BFS, DFS, Dijkstra, and advanced graph problems.',
      icon: '🌳',
      color: '#9f7aea',
      lessonCount: 10,
      duration: '20 hours',
      students: 18000,
      rating: 4.9,
      price: 99,
      path: '/dsa/topic/trees-graphs'
    },
    {
      id: 'dp',
      title: 'Dynamic Programming',
      description: 'Master DP from basics to advanced including knapsack, LCS, matrix chain, and optimization problems.',
      icon: '📈',
      color: '#f56565',
      lessonCount: 10,
      duration: '18 hours',
      students: 20000,
      rating: 4.9,
      price: 99,
      path: '/dsa/topic/dp'
    },
    {
      id: 'searching-sorting',
      title: 'Searching & Sorting',
      description: 'Complete searching and sorting algorithms including binary search, merge sort, quick sort, and hybrid algorithms.',
      icon: '🔍',
      color: '#38b2ac',
      lessonCount: 10,
      duration: '8 hours',
      students: 14000,
      rating: 4.7,
      price: 99,
      path: '/dsa/topic/searching-sorting'
    }
  ];

  // 👈 NEW: DSA Complete Course data
  const dsaCompleteCourse = {
    id: 22,
    title: 'DSA Complete Course',
    description: 'Complete Data Structures & Algorithms course with video lectures, practice problems, and interview preparation.',
    icon: <FaLaptopCode />,
    color: '#8b5cf6',
    lessonCount: 10,
    duration: '120 hours',
    students: 25000,
    rating: 4.9,
    price: 99,
    path: '/courses/22'
  };

  const totalLessons = dsaTopics.reduce((sum, topic) => sum + topic.lessonCount, 0) + dsaCompleteCourse.lessonCount;
  const totalStudents = dsaTopics.reduce((sum, topic) => sum + topic.students, 0) + dsaCompleteCourse.students;
  const avgRating = ((dsaTopics.reduce((sum, topic) => sum + topic.rating, 0) + dsaCompleteCourse.rating) / (dsaTopics.length + 1)).toFixed(1);
  const totalBundleValue = (dsaTopics.length + 1) * 99;

  // Handle back navigation to dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

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
            onClick={handleBackToDashboard}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Data Structures & Algorithms</h1>
          <p className="text-gray-600 dark:text-gray-300">Master DSA with comprehensive topic-wise tutorials and practice problems - All at ₹99/-</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              <FaCode />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{dsaTopics.length + 1}</h3>
              <p className="text-gray-600 dark:text-gray-300">Topics</p>
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
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">All DSA topics at just ₹99/- each! Limited time offer.</span>
        </div>

        {/* DSA Complete Course Card - NEW */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Complete Course</h2>
          <Link
            to={dsaCompleteCourse.path}
            className="block bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                  {dsaCompleteCourse.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{dsaCompleteCourse.title}</h3>
                  <p className="text-white/80">{dsaCompleteCourse.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 mb-4">
                <span className="flex items-center gap-2 text-white/90">
                  <FaClock /> {dsaCompleteCourse.duration}
                </span>
                <span className="flex items-center gap-2 text-white/90">
                  <FaUsers /> {dsaCompleteCourse.students.toLocaleString()}+ students
                </span>
                <span className="flex items-center gap-2 text-yellow-300">
                  <FaStar /> {dsaCompleteCourse.rating}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-2xl font-bold">
                  <FaRupeeSign /> {dsaCompleteCourse.price}/-
                </span>
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all group">
                  View Course <span className="group-hover:translate-x-1 transition-transform">
                    <FaArrowRight/>
                  </span>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* DSA Sheet Promo Banner */}
        <Link 
          to="/dsa/sheet"
          className="block bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-xl p-6 mb-8 transform hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-xl p-4">
                <FaCode className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">📚 DSA Sheet - 300+ Problems</h2>
                <p className="text-white/80">Pattern-wise • Top 150 • Blind 75 • All at ₹99/-</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all group">
              View Sheet <span className="group-hover:translate-x-1 transition-transform">
                <FaArrowRight/>
              </span>
            </span>
          </div>
        </Link>

        {/* Topics Grid */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Topic-wise Practice</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dsaTopics.map((topic) => (
            <Link
              key={topic.id}
              to={topic.path}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Topic Header */}
              <div 
                className="p-6 text-center"
                style={{ 
                  background: `linear-gradient(135deg, ${topic.color}20, ${topic.color}40)`
                }}
              >
                <span className="text-5xl mb-3 block">
                  {topic.icon}
                </span>
                <div 
                  className="inline-block px-4 py-1 rounded-full text-white text-sm font-semibold"
                  style={{ backgroundColor: topic.color }}
                >
                  {topic.lessonCount} Lessons
                </div>
              </div>
              
              {/* Topic Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{topic.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {topic.description}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <FaClock className="text-blue-500" /> {topic.duration}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <FaUsers className="text-green-500" /> {topic.students.toLocaleString()}+
                  </span>
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <FaStar className="text-yellow-500" /> {topic.rating}
                  </span>
                </div>

                {/* Price Tag */}
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg font-semibold mb-4">
                  <FaRupeeSign /> {topic.price}/-
                </div>

                {/* Explore Button */}
                <span className="inline-block w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all">
                  Explore Topic @ ₹99 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DSAPage;