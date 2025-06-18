import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { listenForInstallPrompt } from './utils/pwa'
import { initializeAdmin } from './utils/adminAuth'

// Listen for PWA install prompt
listenForInstallPrompt();

// Initialize admin user if none exists
initializeAdmin();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
