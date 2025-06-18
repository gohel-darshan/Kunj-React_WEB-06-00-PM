import { useState, useEffect } from 'react';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Check if user has previously set a preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      // Check if user's system prefers dark mode
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);
  
  useEffect(() => {
    // Apply dark mode classes to the document
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    
    // Save user preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <div className="dark-mode-toggle">
      <input 
        type="checkbox" 
        id="dark-mode-checkbox" 
        checked={darkMode}
        onChange={toggleDarkMode}
      />
      <label htmlFor="dark-mode-checkbox" className="toggle-label">
        <div className="toggle-background">
          <div className="toggle-icons">
            <div className="sun-icon">
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
            </div>
            <div className="moon-icon">
              <div className="crater"></div>
              <div className="crater"></div>
              <div className="crater"></div>
            </div>
          </div>
          <div className="toggle-circle"></div>
        </div>
      </label>
    </div>
  );
};

export default DarkModeToggle;