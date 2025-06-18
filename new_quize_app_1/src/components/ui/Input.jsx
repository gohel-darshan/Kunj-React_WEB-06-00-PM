import { useState, forwardRef } from 'react';
import styled, { css, keyframes } from 'styled-components';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  disabled = false,
  required = false,
  fullWidth = false,
  variant = 'outlined',
  size = 'medium',
  className,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  
  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };
  
  const hasValue = value !== undefined && value !== '';
  
  return (
    <InputContainer 
      fullWidth={fullWidth} 
      className={`input-container ${className || ''}`}
    >
      {label && (
        <InputLabel 
          focused={focused} 
          hasValue={hasValue}
          disabled={disabled}
          error={!!error}
          variant={variant}
          required={required}
        >
          {label}
        </InputLabel>
      )}
      
      <InputWrapper 
        focused={focused} 
        disabled={disabled}
        error={!!error}
        variant={variant}
        size={size}
        hasIcon={!!icon}
        iconPosition={iconPosition}
      >
        {icon && iconPosition === 'left' && (
          <InputIcon position="left">{icon}</InputIcon>
        )}
        
        <StyledInput
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          hasLabel={!!label}
          variant={variant}
          size={size}
          hasIcon={!!icon}
          iconPosition={iconPosition}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <InputIcon position="right">{icon}</InputIcon>
        )}
        
        {variant === 'filled' && <InputBackground />}
        {variant === 'outlined' && <InputBorder focused={focused} error={!!error} />}
      </InputWrapper>
      
      {(error || helperText) && (
        <InputHelperText error={!!error}>
          {error || helperText}
        </InputHelperText>
      )}
    </InputContainer>
  );
});

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const InputLabel = styled.label`
  position: absolute;
  left: ${props => props.variant === 'standard' ? '0' : '12px'};
  top: ${props => (props.focused || props.hasValue) ? '-8px' : '12px'};
  font-size: ${props => (props.focused || props.hasValue) ? '0.75rem' : '0.875rem'};
  color: ${props => {
    if (props.disabled) return props.theme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)';
    if (props.error) return props.theme.error || '#ff5252';
    if (props.focused) return props.theme.primary || '#4a90e2';
    return props.theme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
  }};
  background-color: ${props => 
    props.variant === 'outlined' && (props.focused || props.hasValue) 
      ? (props.theme.isDark ? '#121212' : '#ffffff') 
      : 'transparent'
  };
  padding: ${props => 
    props.variant === 'outlined' && (props.focused || props.hasValue) 
      ? '0 4px' 
      : '0'
  };
  pointer-events: none;
  transform-origin: left top;
  transition: all 0.2s ease-out;
  z-index: 1;
  
  &::after {
    content: ${props => props.required ? '"*"' : '""'};
    color: ${props => props.theme.error || '#ff5252'};
    margin-left: 2px;
  }
`;

const InputBorder = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  pointer-events: none;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: inherit;
    border: 1px solid ${props => 
      props.error 
        ? props.theme.error || '#ff5252'
        : props.focused 
          ? props.theme.primary || '#4a90e2'
          : props.theme.isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
    };
    transition: border-color 0.2s ease;
  }
  
  &::after {
    border-color: ${props => props.error ? props.theme.error || '#ff5252' : props.theme.primary || '#4a90e2'};
    transform: scaleX(0);
    transition: transform 0.2s ease;
    ${props => props.focused && !props.error && css`
      transform: scaleX(1);
    `}
  }
`;

const InputBackground = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 4px 4px 0 0;
  pointer-events: none;
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  80% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  
  ${props => props.variant === 'standard' && css`
    border-bottom: 1px solid ${
      props.disabled 
        ? props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        : props.error 
          ? props.theme.error || '#ff5252'
          : props.focused 
            ? props.theme.primary || '#4a90e2'
            : props.theme.isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
    };
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${props => props.error ? props.theme.error || '#ff5252' : props.theme.primary || '#4a90e2'};
      transform: scaleX(${props => props.focused ? 1 : 0});
      transition: transform 0.2s ease;
    }
  `}
  
  ${props => props.variant === 'filled' && css`
    border-bottom: 1px solid ${
      props.disabled 
        ? props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        : props.error 
          ? props.theme.error || '#ff5252'
          : props.focused 
            ? props.theme.primary || '#4a90e2'
            : props.theme.isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
    };
    border-radius: 4px 4px 0 0;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${props => props.error ? props.theme.error || '#ff5252' : props.theme.primary || '#4a90e2'};
      transform: scaleX(${props => props.focused ? 1 : 0});
      transition: transform 0.2s ease;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${props => props.theme.primary || '#4a90e2'};
      border-radius: 50%;
      opacity: 0;
      transform: scale(0);
      pointer-events: none;
      
      ${props.focused && css`
        animation: ${ripple} 0.5s ease-out;
      `}
    }
  `}
  
  ${props => props.size === 'small' && css`
    height: 32px;
  `}
  
  ${props => props.size === 'medium' && css`
    height: 40px;
  `}
  
  ${props => props.size === 'large' && css`
    height: 48px;
  `}
`;

const StyledInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: ${props => props.theme.isDark ? '#ffffff' : '#212121'};
  font-size: ${props => 
    props.size === 'small' ? '0.875rem' : 
    props.size === 'large' ? '1.125rem' : 
    '1rem'
  };
  padding: ${props => {
    const verticalPadding = props.size === 'small' ? '0.25rem' : props.size === 'large' ? '0.75rem' : '0.5rem';
    const horizontalPadding = props.variant === 'outlined' ? '0.75rem' : '0';
    const leftPadding = props.hasIcon && props.iconPosition === 'left' ? '2.5rem' : horizontalPadding;
    const rightPadding = props.hasIcon && props.iconPosition === 'right' ? '2.5rem' : horizontalPadding;
    
    return `${verticalPadding} ${rightPadding} ${verticalPadding} ${leftPadding}`;
  }};
  
  &::placeholder {
    color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)'};
    opacity: ${props => props.hasLabel ? 0 : 1};
  }
  
  &:focus::placeholder {
    opacity: 1;
  }
  
  &:disabled {
    cursor: not-allowed;
    color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)'};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.position === 'left' ? 'left: 0.75rem;' : 'right: 0.75rem;'}
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)'};
  pointer-events: none;
`;

const InputHelperText = styled.div`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: ${props => props.error ? props.theme.error || '#ff5252' : props.theme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
`;

export default Input;