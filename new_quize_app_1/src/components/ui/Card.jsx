import styled, { css, keyframes } from 'styled-components';
import { useState } from 'react';

const Card = ({ 
  children, 
  variant = 'default', 
  elevation = 'medium',
  hoverable = false,
  animated = true,
  glassmorphism = false,
  gradient = false,
  borderHighlight = false,
  onClick,
  className,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  return (
    <StyledCard 
      variant={variant} 
      elevation={elevation}
      hoverable={hoverable}
      animated={animated}
      glassmorphism={glassmorphism}
      gradient={gradient}
      borderHighlight={borderHighlight}
      onClick={onClick}
      clickable={!!onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      isHovered={isHovered}
      className={`card ${className || ''}`}
      {...props}
    >
      {children}
      {borderHighlight && <BorderHighlight isHovered={isHovered} />}
    </StyledCard>
  );
};

const getThemeColor = (theme, colorName, fallback) => {
  // Try to get from themeColors first (new structure)
  if (theme.themeColors && theme.themeColors[colorName]) {
    return theme.themeColors[colorName];
  }
  // Fallback to direct theme properties
  return theme[colorName] || fallback;
};

const getVariantStyles = (variant, theme, glassmorphism, gradient) => {
  const primary = getThemeColor(theme, 'primary', '#4a90e2');
  const secondary = getThemeColor(theme, 'secondary', '#50c878');
  const success = getThemeColor(theme, 'success', '#4caf50');
  const error = getThemeColor(theme, 'error', '#ff5252');
  const warning = getThemeColor(theme, 'warning', '#ffc107');
  const surface = getThemeColor(theme, 'surface', theme.isDark ? '#1e1e1e' : '#ffffff');
  const text = getThemeColor(theme, 'text', theme.isDark ? '#ffffff' : '#333333');
  
  // For gradient backgrounds
  const getGradient = (color1, color2) => {
    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
  };
  
  // For glassmorphism effect - using rgba for better compatibility
  const getGlassmorphism = (baseColor, opacity = 0.15) => {
    // Convert hex to rgba
    const hexToRgba = (hex, alpha) => {
      if (!hex.startsWith('#')) return hex;
      
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    return css`
      background-color: ${theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
      backdrop-filter: blur(10px);
      border: 1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    `;
  };
  
  const variants = {
    default: css`
      background: ${glassmorphism 
        ? 'none' 
        : gradient 
          ? getGradient(surface, theme.isDark ? '#2d2d2d' : '#f5f5f5')
          : surface};
      color: ${text};
      
      ${glassmorphism && getGlassmorphism(theme.isDark ? '#ffffff' : '#000000', 0.05)}
    `,
    primary: css`
      background: ${glassmorphism 
        ? 'none' 
        : gradient 
          ? getGradient(primary, theme.isDark ? '#3a7bc2' : '#6ba5e7')
          : primary};
      color: white;
      
      ${glassmorphism && getGlassmorphism(primary, 0.15)}
    `,
    secondary: css`
      background: ${glassmorphism 
        ? 'none' 
        : gradient 
          ? getGradient(secondary, theme.isDark ? '#3da55a' : '#72d695')
          : secondary};
      color: white;
      
      ${glassmorphism && getGlassmorphism(secondary, 0.15)}
    `,
    outlined: css`
      background: transparent;
      color: ${text};
      border: 1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'};
      box-shadow: none;
    `,
    success: css`
      background: ${glassmorphism 
        ? 'none' 
        : gradient 
          ? getGradient(success, theme.isDark ? '#388e3c' : '#66bb6a')
          : success};
      color: white;
      
      ${glassmorphism && getGlassmorphism(success, 0.15)}
    `,
    error: css`
      background: ${glassmorphism 
        ? 'none' 
        : gradient 
          ? getGradient(error, theme.isDark ? '#c62828' : '#ef5350')
          : error};
      color: white;
      
      ${glassmorphism && getGlassmorphism(error, 0.15)}
    `,
    warning: css`
      background: ${glassmorphism 
        ? 'none' 
        : gradient 
          ? getGradient(warning, theme.isDark ? '#f57c00' : '#ffca28')
          : warning};
      color: ${theme.isDark ? 'white' : '#212121'};
      
      ${glassmorphism && getGlassmorphism(warning, 0.15)}
    `,
    glass: css`
      background: ${theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
      backdrop-filter: blur(10px);
      border: 1px solid ${theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
      color: ${theme.isDark ? 'white' : '#212121'};
    `,
  };
  
  return variants[variant] || variants.default;
};

const getElevationStyles = (elevation, theme, isHovered) => {
  const elevations = {
    none: css`
      box-shadow: none;
    `,
    low: css`
      box-shadow: 0 2px 4px rgba(0, 0, 0, ${theme.isDark ? '0.2' : '0.1'});
      
      ${isHovered && css`
        box-shadow: 0 4px 8px rgba(0, 0, 0, ${theme.isDark ? '0.3' : '0.15'});
      `}
    `,
    medium: css`
      box-shadow: 0 4px 8px rgba(0, 0, 0, ${theme.isDark ? '0.25' : '0.15'}), 
                 0 1px 3px rgba(0, 0, 0, ${theme.isDark ? '0.3' : '0.1'});
      
      ${isHovered && css`
        box-shadow: 0 8px 16px rgba(0, 0, 0, ${theme.isDark ? '0.35' : '0.2'}), 
                   0 2px 5px rgba(0, 0, 0, ${theme.isDark ? '0.4' : '0.15'});
      `}
    `,
    high: css`
      box-shadow: 0 10px 20px rgba(0, 0, 0, ${theme.isDark ? '0.3' : '0.15'}), 
                 0 3px 6px rgba(0, 0, 0, ${theme.isDark ? '0.4' : '0.1'});
      
      ${isHovered && css`
        box-shadow: 0 15px 30px rgba(0, 0, 0, ${theme.isDark ? '0.4' : '0.2'}), 
                   0 5px 10px rgba(0, 0, 0, ${theme.isDark ? '0.5' : '0.15'});
      `}
    `,
  };
  
  return elevations[elevation] || elevations.medium;
};

const borderAnimation = keyframes`
  0% {
    width: 0;
    height: 0;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    width: 100%;
    height: 100%;
    opacity: 0;
  }
`;

const StyledCard = styled.div`
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  ${props => getVariantStyles(props.variant, props.theme, props.glassmorphism, props.gradient)}
  ${props => getElevationStyles(props.elevation, props.theme, props.isHovered)}
  
  ${props => props.hoverable && props.animated && css`
    &:hover {
      transform: translateY(-5px);
      
      /* Preserve background styles on hover */
      ${props.glassmorphism && css`
        background-color: ${props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} !important;
        backdrop-filter: blur(10px) !important;
      `}
      
      ${props.gradient && !props.glassmorphism && css`
        background: ${props.variant === 'default' 
          ? `linear-gradient(135deg, ${props.theme.surface} 0%, ${props.theme.isDark ? '#2d2d2d' : '#f5f5f5'} 100%)`
          : props.variant === 'primary'
            ? `linear-gradient(135deg, ${props.theme.primary} 0%, ${props.theme.isDark ? '#3a7bc2' : '#6ba5e7'} 100%)`
            : props.variant === 'secondary'
              ? `linear-gradient(135deg, ${props.theme.secondary} 0%, ${props.theme.isDark ? '#3da55a' : '#72d695'} 100%)`
              : `linear-gradient(135deg, ${props.theme.surface} 0%, ${props.theme.isDark ? '#2d2d2d' : '#f5f5f5'} 100%)`
        } !important;
      `}
    }
  `}
  
  ${props => props.hoverable && !props.animated && css`
    &:hover {
      transform: translateY(-3px);
      
      /* Preserve background styles on hover */
      ${props.glassmorphism && css`
        background-color: ${props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} !important;
        backdrop-filter: blur(10px) !important;
      `}
      
      ${props.gradient && !props.glassmorphism && css`
        background: ${props.variant === 'default' 
          ? `linear-gradient(135deg, ${props.theme.surface} 0%, ${props.theme.isDark ? '#2d2d2d' : '#f5f5f5'} 100%)`
          : props.variant === 'primary'
            ? `linear-gradient(135deg, ${props.theme.primary} 0%, ${props.theme.isDark ? '#3a7bc2' : '#6ba5e7'} 100%)`
            : props.variant === 'secondary'
              ? `linear-gradient(135deg, ${props.theme.secondary} 0%, ${props.theme.isDark ? '#3da55a' : '#72d695'} 100%)`
              : `linear-gradient(135deg, ${props.theme.surface} 0%, ${props.theme.isDark ? '#2d2d2d' : '#f5f5f5'} 100%)`
        } !important;
      `}
    }
  `}
  
  ${props => props.clickable && css`
    cursor: pointer;
    
    &:active {
      transform: translateY(2px);
      transition: transform 0.1s;
    }
  `}
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 10px;
  }
`;

const BorderHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.isHovered ? '100%' : '0'};
    height: ${props => props.isHovered ? '100%' : '0'};
    border: 2px solid transparent;
    border-radius: 12px;
  }
  
  &:before {
    border-top-color: ${props => props.theme.primary || '#4a90e2'};
    border-right-color: ${props => props.theme.primary || '#4a90e2'};
    transition: width 0.25s ease-out, height 0.25s ease-out 0.25s;
  }
  
  &:after {
    bottom: 0;
    right: 0;
    top: auto;
    left: auto;
    border-bottom-color: ${props => props.theme.primary || '#4a90e2'};
    border-left-color: ${props => props.theme.primary || '#4a90e2'};
    transition: width 0.25s ease-out, height 0.25s ease-out 0.25s;
  }
`;

export const CardHeader = styled.div`
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  display: flex;
  justify-content: ${props => props.align || 'space-between'};
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
  }
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const CardSubtitle = styled.h4`
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  font-weight: 400;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const CardBody = styled.div`
  margin-bottom: 1.25rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  flex-wrap: wrap;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    padding-top: 0.5rem;
  }
`;

export const CardImage = styled.div`
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  height: ${props => props.height || '200px'};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
    opacity: ${props => props.overlay ? '1' : '0'};
    transition: opacity 0.3s ease;
  }
  
  @media (max-width: 768px) {
    margin: -1.25rem -1.25rem 1.25rem -1.25rem;
    height: ${props => props.mobileHeight || props.height || '150px'};
  }
`;

export const CardImageCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  color: white;
  z-index: 1;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const CardDivider = styled.hr`
  border: 0;
  height: 1px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  margin: 1.25rem 0;
  
  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props => props.minWidth || '300px'}, 1fr));
  gap: ${props => props.gap || '1.5rem'};
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(${props => props.mobileMinWidth || '250px'}, 1fr));
    gap: ${props => props.mobileGap || '1rem'};
  }
`;

export default Card;