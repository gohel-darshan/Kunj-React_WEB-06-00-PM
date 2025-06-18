import { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'medium',
  showCloseButton = true,
  closeOnOutsideClick = true,
  animation = 'fade',
  position = 'center',
  glassmorphism = false,
  fullHeight = false,
  showBackdrop = true,
  backdropBlur = false,
  footer,
  ...props 
}) => {
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  
  // Handle modal opening and closing animations
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 300); // Match this with the animation duration
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);
  
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle outside click
  const handleOutsideClick = (e) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };
  
  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Match this with the animation duration
  };
  
  if (!isRendered && !isOpen) return null;
  
  return createPortal(
    <ModalOverlay 
      onClick={handleOutsideClick}
      isClosing={isClosing}
      showBackdrop={showBackdrop}
      backdropBlur={backdropBlur}
      position={position}
    >
      <ModalContainer 
        ref={modalRef} 
        size={size} 
        isClosing={isClosing}
        animation={animation}
        position={position}
        glassmorphism={glassmorphism}
        fullHeight={fullHeight}
        {...props}
      >
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {showCloseButton && (
              <CloseButton onClick={handleClose}>
                <FaTimes />
              </CloseButton>
            )}
          </ModalHeader>
        )}
        <ModalContent fullHeight={fullHeight}>
          {children}
        </ModalContent>
        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideInTop = keyframes`
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideOutTop = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-50px); opacity: 0; }
`;

const slideInBottom = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideOutBottom = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(50px); opacity: 0; }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideOutLeft = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-50px); opacity: 0; }
`;

const slideInRight = keyframes`
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideOutRight = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(50px); opacity: 0; }
`;

const zoomIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const zoomOut = keyframes`
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.95); opacity: 0; }
`;

const getAnimation = (animation, isClosing) => {
  const animations = {
    fade: css`animation: ${isClosing ? fadeOut : fadeIn} 0.3s ease-in-out forwards;`,
    slideTop: css`animation: ${isClosing ? slideOutTop : slideInTop} 0.3s ease-in-out forwards;`,
    slideBottom: css`animation: ${isClosing ? slideOutBottom : slideInBottom} 0.3s ease-in-out forwards;`,
    slideLeft: css`animation: ${isClosing ? slideOutLeft : slideInLeft} 0.3s ease-in-out forwards;`,
    slideRight: css`animation: ${isClosing ? slideOutRight : slideInRight} 0.3s ease-in-out forwards;`,
    zoom: css`animation: ${isClosing ? zoomOut : zoomIn} 0.3s ease-in-out forwards;`,
  };
  
  return animations[animation] || animations.fade;
};

const getPositionStyles = (position) => {
  const positions = {
    center: css`
      align-items: center;
      justify-content: center;
    `,
    top: css`
      align-items: flex-start;
      justify-content: center;
      padding-top: 2rem;
    `,
    bottom: css`
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 2rem;
    `,
    left: css`
      align-items: center;
      justify-content: flex-start;
      padding-left: 2rem;
    `,
    right: css`
      align-items: center;
      justify-content: flex-end;
      padding-right: 2rem;
    `,
  };
  
  return positions[position] || positions.center;
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.showBackdrop 
    ? 'rgba(0, 0, 0, 0.5)' 
    : 'transparent'};
  backdrop-filter: ${props => props.backdropBlur ? 'blur(5px)' : 'none'};
  display: flex;
  z-index: 1000;
  padding: 1rem;
  animation: ${props => props.isClosing ? fadeOut : fadeIn} 0.3s ease-in-out forwards;
  
  ${props => getPositionStyles(props.position)}
`;

const ModalContainer = styled.div`
  background-color: ${props => props.glassmorphism 
    ? 'rgba(255, 255, 255, 0.1)' 
    : props.theme.surface};
  border-radius: 12px;
  box-shadow: ${props => props.glassmorphism 
    ? '0 8px 32px rgba(0, 0, 0, 0.1)' 
    : '0 10px 30px rgba(0, 0, 0, 0.15)'};
  width: 100%;
  max-width: ${props => {
    switch (props.size) {
      case 'xs': return '300px';
      case 'small': return '400px';
      case 'large': return '800px';
      case 'xl': return '1000px';
      case 'full': return '95%';
      default: return '600px';
    }
  }};
  max-height: ${props => props.fullHeight ? '95vh' : '90vh'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  ${props => getAnimation(props.animation, props.isClosing)}
  
  ${props => props.glassmorphism && css`
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `}
  
  @media (max-width: 768px) {
    max-width: ${props => props.size === 'full' ? '100%' : '95%'};
    max-height: ${props => props.fullHeight ? '100vh' : '80vh'};
    margin: 0;
    border-radius: ${props => props.position === 'bottom' ? '12px 12px 0 0' : '12px'};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.primary || '#4a90e2'};
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.primary || '#4a90e2'};
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: ${props => props.fullHeight ? '1' : 'none'};
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    flex-wrap: wrap;
  }
`;

export default Modal;