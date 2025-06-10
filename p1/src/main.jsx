import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Student } from './Student.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Student />
  </StrictMode>,
)
