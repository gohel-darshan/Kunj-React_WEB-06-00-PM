import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';
import { isOnline, addConnectivityListeners } from '../../utils/pwa';

const OfflineIndicator = () => {
  const [offline, setOffline] = useState(!isOnline());
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Set initial state
    setOffline(!isOnline());
    
    // Add event listeners for online/offline events
    const handleOnline = () => {
      setOffline(false);
      // Show the indicator briefly when coming back online
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };
    
    const handleOffline = () => {
      setOffline(true);
      setVisible(true);
    };
    
    const removeListeners = addConnectivityListeners(handleOnline, handleOffline);
    
    // Clean up
    return removeListeners;
  }, []);
  
  // Don't render anything if we're online and the indicator isn't visible
  if (!offline && !visible) {
    return null;
  }
  
  return (
    <IndicatorContainer offline={offline}>
      <IndicatorIcon>
        {offline ? <FaExclamationTriangle /> : <FaWifi />}
      </IndicatorIcon>
      <IndicatorText>
        {offline 
          ? 'You are offline. Some features may be unavailable.' 
          : 'You are back online!'}
      </IndicatorText>
    </IndicatorContainer>
  );
};

const IndicatorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: ${props => props.offline 
    ? props.theme.error 
    : props.theme.success};
  color: white;
  z-index: 1001;
  animation: ${props => props.offline ? 'none' : 'fadeOut 3s forwards'};
  
  @keyframes fadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const IndicatorIcon = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const IndicatorText = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
`;

export default OfflineIndicator;