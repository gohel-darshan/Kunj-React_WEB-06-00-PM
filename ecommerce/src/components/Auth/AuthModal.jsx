import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeForm, setActiveForm] = useState('login');
  
  if (!isOpen) return null;
  
  const handleSuccess = (user) => {
    onAuthSuccess(user);
    onClose();
  };
  
  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>
          &times;
        </button>
        
        <div className="auth-modal-content">
          {activeForm === 'login' ? (
            <LoginForm 
              onLogin={handleSuccess} 
              switchToRegister={() => setActiveForm('register')} 
            />
          ) : (
            <RegisterForm 
              onRegister={handleSuccess} 
              switchToLogin={() => setActiveForm('login')} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;