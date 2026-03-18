// ============================================
// FILE: src/context/ThemeContext.tsx
// PURPOSE: Dark/Light theme management
// ============================================

import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ 
  children: React.ReactNode; 
  darkMode: boolean; 
  setDarkMode: (value: boolean) => void;
}> = ({ children, darkMode, setDarkMode }) => {
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply theme to document body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};