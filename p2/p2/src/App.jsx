import { useState, useEffect } from 'react'

function App() {
  const [theme, setTheme] = useState("dark");

  const handleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Apply theme styles to body
  useEffect(() => {
    document.body.style.backgroundColor = theme === "dark" ? "#1a1a1a" : "#f5f5f5";
    document.body.style.color = theme === "dark" ? "#e0e0e0" : "#333";
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.margin = "0";
    document.body.style.padding = "20px";
    document.body.style.minHeight = "100vh";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
  }, [theme]);

  const buttonStyle = {
    fontSize: '2rem',
    padding: '15px 25px',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    backgroundColor: theme === "dark" ? "#333" : "#fff",
    color: theme === "dark" ? "#fff" : "#333",
    boxShadow: theme === "dark" ? "0 4px 8px rgba(0, 0, 0, 0.3)" : "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: theme === "dark" ? "2px solid #555" : "2px solid #ddd"
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '2.5rem' }}>Theme Toggle</h1>
      <button 
        onClick={handleTheme} 
        style={buttonStyle}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {theme === "dark" ? "☀️" : "🌙"}
        <span style={{ fontSize: '1.2rem' }}>
          Switch to {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      </button>
      <p style={{ marginTop: '30px', fontSize: '1.2rem' }}>
        Click the {theme === "dark" ? "sun ☀️" : "moon 🌙"} to switch to {theme === "dark" ? "light" : "dark"} mode
      </p>
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        borderRadius: '10px',
        backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
        boxShadow: theme === "dark" ? "0 2px 10px rgba(0, 0, 0, 0.3)" : "0 2px 10px rgba(0, 0, 0, 0.1)"
      }}>
        <h3>Current Theme: <strong>{theme === "dark" ? "Dark 🌙" : "Light ☀️"}</strong></h3>
        <p>The theme changes the entire page background and colors!</p>
      </div>
    </div>
  )
}

export default App
