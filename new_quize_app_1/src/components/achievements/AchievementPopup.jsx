import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTrophy, FaTimes } from 'react-icons/fa';

const AchievementPopup = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (achievement) {
      setVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Call onClose after exit animation
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);
  
  if (!achievement) return null;
  
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500); // Call onClose after exit animation
  };
  
  return (
    <PopupContainer visible={visible}>
      <PopupContent>
        <IconContainer>
          <FaTrophy />
        </IconContainer>
        <TextContainer>
          <Title>Achievement Unlocked!</Title>
          <Name>{achievement.name}</Name>
          <Description>{achievement.description}</Description>
        </TextContainer>
        <CloseButton onClick={handleClose}>
          <FaTimes />
        </CloseButton>
      </PopupContent>
    </PopupContainer>
  );
};

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: ${props => props.visible ? slideIn : slideOut} 0.5s ease forwards;
`;

const PopupContent = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.surface};
  border-left: 4px solid ${props => props.theme.primary};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 350px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.primary};
  color: white;
  margin-right: 1rem;
  font-size: 1.2rem;
`;

const TextContainer = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: ${props => props.theme.primary};
`;

const Name = styled.div`
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const Description = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  opacity: 0.5;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  
  &:hover {
    opacity: 1;
  }
`;

export default AchievementPopup;