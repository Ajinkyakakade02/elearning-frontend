import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGraduationCap,
  FaChartLine,
  FaArrowRight
} from 'react-icons/fa';

interface FooterProps {
  darkMode?: boolean;
}

const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();

  // Social media links with valid URLs
  const socialLinks = [
    { icon: FaFacebook, url: 'https://facebook.com/elearn', label: 'Facebook' },
    { icon: FaTwitter, url: 'https://twitter.com/elearn', label: 'Twitter' },
    { icon: FaInstagram, url: 'https://instagram.com/elearn', label: 'Instagram' },
    { icon: FaLinkedin, url: 'https://linkedin.com/company/elearn', label: 'LinkedIn' }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert('Newsletter subscription - Coming soon!');
  };

  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white py-16 px-4 relative overflow-hidden">
    
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* About Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <FaBook className="text-3xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                E-LEARN
              </span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
                PRO
              </span>
            </Link>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              India's most comprehensive learning platform for competitive exams. 
              Join 50,000+ successful students on their journey to excellence.
            </p>
            
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, url, label }, index) => (
                <a 
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 bg-gray-200 dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 text-gray-600 dark:text-gray-300 hover:text-white"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 dark:after:from-blue-400 dark:after:to-purple-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { path: '/jee', label: 'JEE Preparation' },
                { path: '/neet', label: 'NEET UG' },
                { path: '/upsc', label: 'UPSC CSE' },
                { path: '/mhtcet', label: 'MHT-CET' },
                { path: '/dsa', label: 'DSA' }
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 dark:after:from-blue-400 dark:after:to-purple-400">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { path: '/quiz', label: 'Practice Quizzes' },
                { path: '/my-courses', label: 'My Courses' },
                { path: '/progress', label: 'Progress Tracker' },
                { path: '/certificates', label: 'Certificates' },
                { path: '/wishlist', label: 'Wishlist' }
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-purple-600 dark:bg-purple-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 dark:after:from-blue-400 dark:after:to-purple-400">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <FaEnvelope className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <a href="mailto:support@elearn.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  support@elearn.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <FaPhone className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>Pune, Maharashtra</span>
              </li>
            </ul>
            
            {/* Newsletter - Fixed form submission */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 dark:text-gray-200">Subscribe to Newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  required
                  aria-label="Email for newsletter"
                  className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
                <button 
                  type="submit"
                  className="px-2 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Subscribe <FaArrowRight className="text-sm" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
            © {currentYear} E-LEARN Platform. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <FaGraduationCap className="text-blue-600 dark:text-blue-400" /> 50,000+ Students
            </span>
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <FaBook className="text-blue-600 dark:text-blue-400" /> 1,200+ Courses
            </span>
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <FaChartLine className="text-blue-600 dark:text-blue-400" /> 20,000+ Quizzes
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;