import styled, { css, keyframes } from 'styled-components';
import { useState } from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false, 
  disabled = false, 
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  animated = true,
  loading = false,
  ripple = true,
  ...props 
}) => {
  const [rippleEffect, setRippleEffect] = useState({ active: false, x: 0, y: 0 });
  
  const handleClick = (e) => {
    if (disabled || loading) return;
    
    if (ripple) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setRippleEffect({ active: true, x, y });
      
      setTimeout(() => {
        setRippleEffect({ active: false, x: 0, y: 0 });
      }, 600);
    }
    
    if (onClick) onClick(e);
  };
  
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      iconPosition={iconPosition}
      hasIcon={!!icon}
      onClick={handleClick}
      type={type}
      animated={animated}
      loading={loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {icon && iconPosition === 'left' && <IconWrapper iconPosition="left">{icon}</IconWrapper>}
          <ButtonText>{children}</ButtonText>
          {icon && iconPosition === 'right' && <IconWrapper iconPosition="right">{icon}</IconWrapper>}
          
          {ripple && rippleEffect.active && (
            <RippleEffect 
              style={{ 
                left: rippleEffect.x, 
                top: rippleEffect.y 
              }} 
            />
          )}
        </>
      )}
    </StyledButton>
  );
};

const getVariantStyles = (variant, theme, animated) => {
  const getThemeColor = (colorName) => {
    // Try to get from themeColors first (new structure)
    if (theme.themeColors && theme.themeColors[colorName]) {
      return theme.themeColors[colorName];
    }
    // Fallback to direct theme properties
    return theme[colorName];
  };

  const primary = getThemeColor('primary') || '#4a90e2';
  const secondary = getThemeColor('secondary') || '#50c878';
  const error = getThemeColor('error') || '#ff5252';
  const success = getThemeColor('success') || '#4caf50';
  const warning = getThemeColor('warning') || '#ffc107';
  
  const darkenColor = (color) => {
    if (!color.startsWith('#')) return color;
    
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    const darkenAmount = 0.15;
    const darkenR = Math.max(0, Math.floor(r * (1 - darkenAmount)));
    const darkenG = Math.max(0, Math.floor(g * (1 - darkenAmount)));
    const darkenB = Math.max(0, Math.floor(b * (1 - darkenAmount)));
    
    return `#${darkenR.toString(16).padStart(2, '0')}${darkenG.toString(16).padStart(2, '0')}${darkenB.toString(16).padStart(2, '0')}`;
  };
  
  const lightenColor = (color) => {
    if (!color.startsWith('#')) return color;
    
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    const lightenAmount = 0.15;
    const lightenR = Math.min(255, Math.floor(r + (255 - r) * lightenAmount));
    const lightenG = Math.min(255, Math.floor(g + (255 - g) * lightenAmount));
    const lightenB = Math.min(255, Math.floor(b + (255 - b) * lightenAmount));
    
    return `#${lightenR.toString(16).padStart(2, '0')}${lightenG.toString(16).padStart(2, '0')}${lightenB.toString(16).padStart(2, '0')}`;
  };
  
  const variants = {
    primary: css`
      background: ${animated 
        ? `linear-gradient(135deg, ${primary} 0%, ${darkenColor(primary)} 100%)`
        : primary};
      color: white;
      box-shadow: 0 4px 6px rgba(74, 144, 226, 0.25);
      
      &:hover:not(:disabled) {
        background: ${animated 
          ? `linear-gradient(135deg, ${lightenColor(primary)} 0%, ${primary} 100%)`
          : darkenColor(primary)};
        box-shadow: 0 6px 8px rgba(74, 144, 226, 0.35);
        transform: translateY(-2px);
      }
      
      &:active:not(:disabled) {
        box-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
        transform: translateY(1px);
      }
    `,
    secondary: css`
      background: ${animated 
        ? `linear-gradient(135deg, ${secondary} 0%, ${darkenColor(secondary)} 100%)`
        : secondary};
      color: white;
      box-shadow: 0 4px 6px rgba(80, 200, 120, 0.25);
      
      &:hover:not(:disabled) {
        background: ${animated 
          ? `linear-gradient(135deg, ${lightenColor(secondary)} 0%, ${secondary} 100%)`
          : darkenColor(secondary)};
        box-shadow: 0 6px 8px rgba(80, 200, 120, 0.35);
        transform: translateY(-2px);
      }
      
      &:active:not(:disabled) {
        box-shadow: 0 2px 4px rgba(80, 200, 120, 0.2);
        transform: translateY(1px);
      }
    `,
    outline: css`
      background: transparent;
      color: ${primary};
      border: 2px solid ${primary};
      box-shadow: none;
      
      &:hover:not(:disabled) {
        background: ${animated 
          ? `linear-gradient(135deg, ${primary}15 0%, ${primary}30 100%)`
          : `${primary}15`};
        border-color: ${lightenColor(primary)};
        transform: translateY(-2px);
      }
      
      &:active:not(:disabled) {
        background: ${primary}30;
        transform: translateY(1px);
      }
    `,
    text: css`
      background: transparent;
      color: ${primary};
      border: none;
      padding: 0.5rem 1rem;
      box-shadow: none;
      
      &:hover:not(:disabled) {
        background: ${primary}10;
        transform: translateY(-1px);
      }
      
      &:active:not(:disabled) {
        background: ${primary}20;
        transform: translateY(0);
      }
    `,
    danger: css`
      background: ${animated 
        ? `linear-gradient(135deg, ${error} 0%, ${darkenColor(error)} 100%)`
        : error};
      color: white;
      box-shadow: 0 4px 6px rgba(255, 82, 82, 0.25);
      
      &:hover:not(:disabled) {
        background: ${animated 
          ? `linear-gradient(135deg, ${lightenColor(error)} 0%, ${error} 100%)`
          : darkenColor(error)};
        box-shadow: 0 6px 8px rgba(255, 82, 82, 0.35);
        transform: translateY(-2px);
      }
      
      &:active:not(:disabled) {
        box-shadow: 0 2px 4px rgba(255, 82, 82, 0.2);
        transform: translateY(1px);
      }
    `,
    success: css`
      background: ${animated 
        ? `linear-gradient(135deg, ${success} 0%, ${darkenColor(success)} 100%)`
        : success};
      color: white;
      box-shadow: 0 4px 6px rgba(76, 175, 80, 0.25);
      
      &:hover:not(:disabled) {
        background: ${animated 
          ? `linear-gradient(135deg, ${lightenColor(success)} 0%, ${success} 100%)`
          : darkenColor(success)};
        box-shadow: 0 6px 8px rgba(76, 175, 80, 0.35);
        transform: translateY(-2px);
      }
      
      &:active:not(:disabled) {
        box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
        transform: translateY(1px);
      }
    `,
    warning: css`
      background: ${animated 
        ? `linear-gradient(135deg, ${warning} 0%, ${darkenColor(warning)} 100%)`
        : warning};
      color: #212121;
      box-shadow: 0 4px 6px rgba(255, 193, 7, 0.25);
      
      &:hover:not(:disabled) {
        background: ${animated 
          ? `linear-gradient(135deg, ${lightenColor(warning)} 0%, ${warning} 100%)`
          : darkenColor(warning)};
        box-shadow: 0 6px 8px rgba(255, 193, 7, 0.35);
        transform: translateY(-2px);
      }
      
      &:active:not(:disabled) {
        box-shadow: 0 2px 4px rgba(255, 193, 7, 0.2);
        transform: translateY(1px);
      }
    `,
    glass: css`
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      
      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }
      
      &:active:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateY(1px);
      }
    `,
  };
  
  return variants[variant] || variants.primary;
};

const getSizeStyles = (size) => {
  const sizes = {
    small: css`
      padding: 0.4rem 0.8rem;
      font-size: 0.875rem;
      height: 32px;
      border-radius: 4px;
    `,
    medium: css`
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
      height: 40px;
      border-radius: 6px;
    `,
    large: css`
      padding: 0.8rem 1.6rem;
      font-size: 1.125rem;
      height: 48px;
      border-radius: 8px;
    `,
    xlarge: css`
      padding: 1rem 2rem;
      font-size: 1.25rem;
      height: 56px;
      border-radius: 10px;
    `,
  };
  
  return sizes[size] || sizes.medium;
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
  outline: none;
  position: relative;
  overflow: hidden;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  letter-spacing: 0.5px;
  
  ${props => getVariantStyles(props.variant, props.theme, props.animated)}
  ${props => getSizeStyles(props.size)}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: ${props => props.size === 'large' ? '0.7rem 1.4rem' : 
               props.size === 'small' ? '0.3rem 0.7rem' : '0.5rem 1rem'};
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 1;
  white-space: nowrap;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.iconPosition === 'left' ? '0.5rem' : 0};
  margin-left: ${props => props.iconPosition === 'right' ? '0.5rem' : 0};
  position: relative;
  z-index: 1;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: ${spin} 0.8s linear infinite;
`;

const RippleEffect = styled.span`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  width: 100px;
  height: 100px;
  margin-top: -50px;
  margin-left: -50px;
  animation: ${ripple} 0.6s linear;
  pointer-events: none;
`;

export default Button;