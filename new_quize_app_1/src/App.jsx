import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { ThemeProvider } from './contexts/ThemeContext';
import { QuizProvider } from './contexts/QuizContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage from './pages/SettingsPage';
import CreateQuizPage from './pages/CreateQuizPage';
import MyQuizzesPage from './pages/MyQuizzesPage';
import AchievementsPage from './pages/AchievementsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRouteGuard from './components/admin/AdminRouteGuard';
import ParticleBackground from './components/effects/ParticleBackground';
import './App.css';

// Global styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  :root {
    --transition-speed: 0.3s;
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 16px;
    --box-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --box-shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
    --box-shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
    --font-family: 'Poppins', sans-serif;
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-xxl: 3rem;
    
    /* Theme colors */
    --primary-color: #4a90e2;
    --secondary-color: #50c878;
    --accent-color: #ff6b6b;
    --background-color: #f5f5f5;
    --surface-color: #ffffff;
    --text-color: #333333;
    --error-color: #ff5252;
    --success-color: #4caf50;
    --warning-color: #ffc107;
  }

  [data-theme="dark"] {
    --primary-color: #4a90e2;
    --secondary-color: #50c878;
    --accent-color: #ff6b6b;
    --background-color: #121212;
    --surface-color: #1e1e1e;
    --text-color: #ffffff;
    --error-color: #ff5252;
    --success-color: #4caf50;
    --warning-color: #ffc107;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }
  
  body {
    font-family: var(--font-family);
    line-height: 1.6;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
    overflow-x: hidden;
  }
  
  a {
    text-decoration: none;
    color: var(--primary-color);
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--accent-color);
    }
  }
  
  button {
    cursor: pointer;
    font-family: var(--font-family);
  }
  
  input, select, textarea {
    font-family: var(--font-family);
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: var(--spacing-md);
    font-weight: 600;
    line-height: 1.3;
  }
  
  p {
    margin-bottom: var(--spacing-md);
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }
  
  .slide-up {
    animation: slideUp 0.5s ease forwards;
  }
  
  .pulse {
    animation: pulse 2s infinite;
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
  
  /* Toast styling overrides */
  .Toastify__toast {
    border-radius: var(--border-radius-md);
    font-family: var(--font-family);
  }
  
  .Toastify__toast--success {
    background-color: var(--success-color);
  }
  
  .Toastify__toast--error {
    background-color: var(--error-color);
  }
  
  .Toastify__toast--warning {
    background-color: var(--warning-color);
  }
  
  .Toastify__toast--info {
    background-color: var(--primary-color);
  }
  
  /* Modal content styling */
  .modal-content h3 {
    color: var(--primary-color);
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  .modal-content h3:first-child {
    margin-top: 0;
  }
  
  .modal-content p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  .modal-content ul {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  .modal-content li {
    margin-bottom: 0.5rem;
  }
`;

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <QuizProvider>
          <Router>
            <GlobalStyle />
            <ToastContainer 
              position="top-right" 
              autoClose={3000} 
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <ParticleBackground />
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/create-quiz" element={<CreateQuizPage />} />
                <Route path="/my-quizzes" element={<MyQuizzesPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <AdminRouteGuard>
                    <AdminDashboard />
                  </AdminRouteGuard>
                } />
                <Route path="/admin/users" element={
                  <AdminRouteGuard>
                    <AdminUsers />
                  </AdminRouteGuard>
                } />
                <Route path="/admin/categories" element={
                  <AdminRouteGuard>
                    <AdminCategories />
                  </AdminRouteGuard>
                } />
                <Route path="/admin/questions" element={
                  <AdminRouteGuard>
                    <AdminQuestions />
                  </AdminRouteGuard>
                } />
                <Route path="/admin/analytics" element={
                  <AdminRouteGuard>
                    <AdminAnalytics />
                  </AdminRouteGuard>
                } />
                <Route path="/admin/settings" element={
                  <AdminRouteGuard>
                    <AdminSettings />
                  </AdminRouteGuard>
                } />
              </Routes>
            </Layout>
          </Router>
        </QuizProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
