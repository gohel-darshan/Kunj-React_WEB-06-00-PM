import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaDownload, FaTimes } from 'react-icons/fa';
import Button from '../ui/Button';
import { canInstallPWA, promptInstallPWA } from '../../utils/pwa';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    // Check if the app can be installed
    const checkInstallable = () => {
      const installable = canInstallPWA();
      setShowPrompt(installable);
    };
    
    // Check initially
    checkInstallable();
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = () => {
      checkInstallable();
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Clean up
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstall = async () => {
    const installed = await promptInstallPWA();
    if (installed) {
      setShowPrompt(false);
    }
  };
  
  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember the user's choice for 7 days
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
  };
  
  if (!showPrompt) {
    return null;
  }
  
  return (
    <PromptContainer>
      <PromptContent>
        <PromptIcon>📱</PromptIcon>
        <PromptText>
          <PromptTitle>Install QuizMaster</PromptTitle>
          <PromptDescription>
            Add QuizMaster to your home screen for a better experience!
          </PromptDescription>
        </PromptText>
        <PromptActions>
          <Button 
            variant="primary" 
            size="small" 
            icon={<FaDownload />} 
            onClick={handleInstall}
          >
            Install
          </Button>
          <DismissButton onClick={handleDismiss}>
            <FaTimes />
          </DismissButton>
        </PromptActions>
      </PromptContent>
    </PromptContainer>
  );
};

const PromptContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 400px;
`;

const PromptContent = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const PromptIcon = styled.div`
  font-size: 2rem;
  margin-right: 1rem;
`;

const PromptText = styled.div`
  flex: 1;
`;

const PromptTitle = styled.h3`
  margin: 0 0 0.25rem;
  font-size: 1rem;
`;

const PromptDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
`;

const PromptActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  opacity: 0.6;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 1;
  }
`;

export default InstallPrompt;