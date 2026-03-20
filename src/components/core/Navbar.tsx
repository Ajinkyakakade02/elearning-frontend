import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserCircle,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaBook,
  FaQuestionCircle,
  FaShieldAlt,
  FaGlobe,
  FaChevronRight,
  FaTrophy,
  FaStar,
  FaGraduationCap,
  FaExternalLinkAlt,
  FaChartLine,
  FaHome,
  FaCode,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onSearch?: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, onSearch }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState('English');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Format time ago
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + ' year' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + ' month' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + ' day' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + ' hour' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + ' minute' + (interval === 1 ? '' : 's') + ' ago';
    
    return 'just now';
  };

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setShowNotifications(false);
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  // Get avatar icon - simplified for students only
  const getAvatarIcon = () => {
    return <FaGraduationCap />;
  };

  // Get random color based on user name
  const getAvatarColor = () => {
    if (!user?.fullName) return '#667eea';
    
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#fa709a'
    ];
    
    const index = user.fullName.length % colors.length;
    return colors[index];
  };

  // Handle navigation with authentication check
  const handleNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccount(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // User data for display
  const userData = {
    name: user?.fullName || 'Student',
    email: user?.email || '',
    avatar: getAvatarIcon(),
    avatarColor: getAvatarColor(),
    membership: 'Student',
    enrolled: 12,
    completed: 8,
    streak: 15
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg' 
        : 'bg-white dark:bg-gray-900'
    } ${darkMode ? 'dark' : ''}`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
            <FaBook className="text-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              E-Learn
            </span>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
              PRO
            </span>
          </Link>

          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex items-center gap-2 mx-4">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-2"
            >
              <FaHome className="text-lg" />
              Home
            </button>
            
            <button
              onClick={() => handleNavigation('/courses')}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-2"
            >
              <FaBook className="text-lg" />
              Courses
            </button>
            
            <button
              onClick={() => handleNavigation('/quiz')}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-2"
            >
              <FaStar className="text-lg" />
              Quizzes
            </button>
            
            <button
              onClick={() => handleNavigation('/dsa/sheet')}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-2"
            >
              <FaCode className="text-lg" />
              DSA Sheet
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>

          {/* Action Icons */}
          <div className="hidden md:flex items-center gap-2">
            
            {/* Notifications - Only show if logged in */}
            {user && (
              <div className="relative" ref={notificationsRef}>
                <button 
                  className={`relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
                    showNotifications ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FaBell className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-slideDown">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                              !notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onClick={() => handleNotificationClick(notif)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleNotificationClick(notif);
                              }
                            }}
                          >
                            <div className="flex gap-3">
                              <span className="text-xl">{notif.icon}</span>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white text-sm">{notif.title}</p>
                                <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">{notif.message}</p>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                                  {timeAgo(notif.createdAt)}
                                </span>
                              </div>
                              <FaExternalLinkAlt className="text-gray-400 text-xs mt-1" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                          <FaBell className="text-4xl mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button 
                className={`p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
                  showSettings ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-800' : ''
                }`}
                onClick={() => setShowSettings(!showSettings)}
              >
                <FaCog className="text-xl" />
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-slideDown">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-800 dark:text-white">Settings</span>
                  </div>
                  
                  <div className="p-3">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Theme</span>
                      <button 
                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setDarkMode(!darkMode)}
                      >
                        {darkMode ? <FaSun /> : <FaMoon />}
                        <span>{darkMode ? 'Light' : 'Dark'}</span>
                      </button>
                    </div>

                    {/* Notifications Toggle - Only show if logged in */}
                    {user && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={notificationsEnabled}
                            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    )}

                    {/* Language Select */}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Language</span>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2">
                      <FaShieldAlt /> Privacy Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2">
                      <FaQuestionCircle /> Help & Support
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2">
                      <FaGlobe /> Terms & Policy
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Account Dropdown - Only show if logged in */}
            {user && (
              <div className="relative" ref={accountRef}>
                <button 
                  className={`p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
                    showAccount ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                  onClick={() => setShowAccount(!showAccount)}
                >
                  <span 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ backgroundColor: userData.avatarColor }}
                  >
                    {userData.avatar}
                  </span>
                </button>

                {showAccount && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-slideDown">
                    {/* Account Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-white/20 border-2 border-white"
                          style={{ backgroundColor: userData.avatarColor }}
                        >
                          {userData.avatar}
                        </span>
                        <div>
                          <h4 className="font-semibold">{userData.name}</h4>
                          <p className="text-sm text-white/80">{userData.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                            Student
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800 dark:text-white">{userData.enrolled}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Enrolled</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800 dark:text-white">{userData.completed}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800 dark:text-white">{userData.streak}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Streak</div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link to="/profile" className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setShowAccount(false)}>
                        <span className="flex items-center gap-2"><FaUserCircle /> Profile</span>
                        <FaChevronRight className="text-xs text-gray-400" />
                      </Link>
                      <Link to="/my-courses" className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setShowAccount(false)}>
                        <span className="flex items-center gap-2"><FaBook /> My Courses</span>
                        <FaChevronRight className="text-xs text-gray-400" />
                      </Link>
                      
                      {/* Progress Page Link */}
                      <Link to="/progress" className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setShowAccount(false)}>
                        <span className="flex items-center gap-2"><FaChartLine /> Progress</span>
                        <FaChevronRight className="text-xs text-gray-400" />
                      </Link>
                      
                      <Link to="/certificates" className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setShowAccount(false)}>
                        <span className="flex items-center gap-2"><FaTrophy /> Certificates</span>
                        <FaChevronRight className="text-xs text-gray-400" />
                      </Link>
                      <Link to="/wishlist" className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setShowAccount(false)}>
                        <span className="flex items-center gap-2"><FaStar /> Wishlist</span>
                        <FaChevronRight className="text-xs text-gray-400" />
                      </Link>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                      
                      <button onClick={handleLogout} className="w-full flex items-center justify-between px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <span className="flex items-center gap-2"><FaSignOutAlt /> Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* If not logged in, show Login button */}
            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg py-4 px-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium text-left flex items-center gap-3 transition-colors"
              >
                <FaHome className="text-lg" />
                <span>Home</span>
              </button>
              <button
                onClick={() => handleNavigation('/courses')}
                className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium text-left flex items-center gap-3 transition-colors"
              >
                <FaBook className="text-lg" />
                <span>Courses</span>
              </button>
              <button
                onClick={() => handleNavigation('/quiz')}
                className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium text-left flex items-center gap-3 transition-colors"
              >
                <FaStar className="text-lg" />
                <span>Quizzes</span>
              </button>
              <button
                onClick={() => handleNavigation('/dsa/sheet')}
                className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium text-left flex items-center gap-3 transition-colors"
              >
                <FaCode className="text-lg" />
                <span>DSA Sheet</span>
              </button>
            </div>
            
            {/* Mobile Auth Button */}
            {!user && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all text-center"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;