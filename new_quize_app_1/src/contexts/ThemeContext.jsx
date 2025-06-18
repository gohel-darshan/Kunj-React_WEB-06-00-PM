import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('quizTheme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [themeColors, setThemeColors] = useState({
    primary: '#4a90e2',
    secondary: '#50c878',
    accent: '#ff6b6b',
    background: darkMode ? '#121212' : '#f5f5f5',
    surface: darkMode ? '#1e1e1e' : '#ffffff',
    text: darkMode ? '#ffffff' : '#333333',
    error: '#ff5252',
    success: '#4caf50',
    warning: '#ffc107',
  });

  // Update theme when darkMode changes
  useEffect(() => {
    const newColors = {
      ...themeColors,
      background: darkMode ? '#121212' : '#f5f5f5',
      surface: darkMode ? '#1e1e1e' : '#ffffff',
      text: darkMode ? '#ffffff' : '#333333',
    };
    
    setThemeColors(newColors);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    
    // Save theme preference
    localStorage.setItem('quizTheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Update theme colors
  const updateThemeColors = (newColors) => {
    setThemeColors({ ...themeColors, ...newColors });
  };

  const value = {
    darkMode,
    themeColors,
    toggleDarkMode,
    updateThemeColors,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};