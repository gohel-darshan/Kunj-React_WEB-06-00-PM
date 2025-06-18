import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatTime } from '../../utils/helpers';

const Timer = ({ 
  initialTime, 
  onTimeUp, 
  isActive = true,
  isPaused = false,
  showHours = false,
  size = 'medium',
  variant = 'default',
  warningThreshold = 30, // seconds
  dangerThreshold = 10, // seconds
  ...props 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  
  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime]);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && onTimeUp) {
      onTimeUp();
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeRemaining, onTimeUp]);
  
  const getTimerColor = () => {
    if (timeRemaining <= dangerThreshold) return 'danger';
    if (timeRemaining <= warningThreshold) return 'warning';
    return variant;
  };
  
  const formattedTime = formatTime(timeRemaining, showHours);
  const timerColor = getTimerColor();
  
  return (
    <TimerContainer size={size} color={timerColor} {...props}>
      <TimerIcon color={timerColor} size={size} />
      <TimerText color={timerColor} size={size}>{formattedTime}</TimerText>
    </TimerContainer>
  );
};

const getSizeStyles = (size) => {
  const sizes = {
    small: {
      container: '1.5rem',
      icon: '0.875rem',
      text: '0.875rem',
    },
    medium: {
      container: '2rem',
      icon: '1rem',
      text: '1rem',
    },
    large: {
      container: '2.5rem',
      icon: '1.25rem',
      text: '1.25rem',
    },
  };
  
  return sizes[size] || sizes.medium;
};

const getColorStyles = (color, theme) => {
  const colors = {
    default: theme.text,
    primary: theme.primary,
    secondary: theme.secondary,
    warning: theme.warning,
    danger: theme.error,
    success: theme.success,
  };
  
  return colors[color] || colors.default;
};

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  height: ${props => getSizeStyles(props.size).container};
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background-color: ${props => props.theme.isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.05)'
  };
`;

const TimerIcon = styled.div`
  width: ${props => getSizeStyles(props.size).icon};
  height: ${props => getSizeStyles(props.size).icon};
  margin-right: 0.5rem;
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid ${props => getColorStyles(props.color, props.theme)};
  }
  
  &::after {
    border-left-color: transparent;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TimerText = styled.span`
  font-size: ${props => getSizeStyles(props.size).text};
  font-weight: 600;
  font-family: monospace;
  color: ${props => getColorStyles(props.color, props.theme)};
`;

export default Timer;