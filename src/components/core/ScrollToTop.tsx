import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Automatically scrolls to the top of the page when the route changes.
 * This fixes the issue where navigating between pages keeps the scroll position.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top instantly when the path changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'smooth' for animated scrolling
    });
  }, [pathname]); // Runs every time the URL path changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;
