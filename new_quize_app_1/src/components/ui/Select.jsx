import { useState, useRef, useEffect, forwardRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

const Select = forwardRef(({
  options = [],
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  variant = 'outlined',
  size = 'medium',
  multiple = false,
  searchable = false,
  className,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const inputRef = useRef(null);
  
  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Focus input when dropdown opens and searchable is true
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);
  
  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFocused(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };
  
  const handleOptionClick = (option) => {
    if (multiple) {
      // For multiple select, toggle the selected option
      const newValue = Array.isArray(value) ? [...value] : [];
      const optionIndex = newValue.findIndex(item => item.value === option.value);
      
      if (optionIndex > -1) {
        newValue.splice(optionIndex, 1);
      } else {
        newValue.push(option);
      }
      
      if (onChange) {
        onChange(newValue);
      }
    } else {
      // For single select, set the selected option and close dropdown
      if (onChange) {
        onChange(option);
      }
      setIsOpen(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setFocused(false);
    } else if (e.key === 'Enter' && !isOpen) {
      setIsOpen(true);
      setFocused(true);
    }
  };
  
  // Filter options based on search term
  const filteredOptions = searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;
  
  // Determine if we have a value
  const hasValue = multiple 
    ? Array.isArray(value) && value.length > 0
    : value !== undefined && value !== null;
  
  // Get display value for the select
  const getDisplayValue = () => {
    if (!hasValue) return '';
    
    if (multiple) {
      if (Array.isArray(value) && value.length > 0) {
        if (value.length === 1) {
          return value[0].label;
        }
        return `${value.length} selected`;
      }
      return '';
    }
    
    return value?.label || '';
  };
  
  // Check if an option is selected
  const isOptionSelected = (option) => {
    if (multiple) {
      return Array.isArray(value) && value.some(item => item.value === option.value);
    }
    return value?.value === option.value;
  };
  
  return (
    <SelectContainer 
      ref={selectRef}
      fullWidth={fullWidth} 
      className={`select-container ${className || ''}`}
    >
      {label && (
        <SelectLabel 
          focused={focused || isOpen} 
          hasValue={hasValue}
          disabled={disabled}
          error={!!error}
          variant={variant}
          required={required}
        >
          {label}
        </SelectLabel>
      )}
      
      <SelectWrapper 
        focused={focused || isOpen} 
        disabled={disabled}
        error={!!error}
        variant={variant}
        size={size}
        onClick={handleToggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        ref={ref}
        {...props}
      >
        {searchable && isOpen ? (
          <SearchInput
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={(e) => e.stopPropagation()}
            placeholder="Search..."
            size={size}
          />
        ) : (
          <SelectValue hasValue={hasValue} placeholder={placeholder}>
            {getDisplayValue() || placeholder}
          </SelectValue>
        )}
        
        <SelectIcon isOpen={isOpen}>
          <FaChevronDown />
        </SelectIcon>
        
        {variant === 'filled' && <SelectBackground />}
        {variant === 'outlined' && <SelectBorder focused={focused || isOpen} error={!!error} />}
      </SelectWrapper>
      
      {isOpen && (
        <OptionsContainer 
          size={size}
          variant={variant}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <Option 
                key={option.value} 
                selected={isOptionSelected(option)}
                onClick={() => handleOptionClick(option)}
                size={size}
              >
                <OptionLabel>{option.label}</OptionLabel>
                {multiple && isOptionSelected(option) && (
                  <OptionCheckmark>
                    <FaCheck />
                  </OptionCheckmark>
                )}
              </Option>
            ))
          ) : (
            <NoOptions>No options found</NoOptions>
          )}
        </OptionsContainer>
      )}
      
      {(error || helperText) && (
        <HelperText error={!!error}>
          {error || helperText}
        </HelperText>
      )}
    </SelectContainer>
  );
});

const SelectContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  width: ${props => props.fullWidth ? '100%' : '240px'};
`;

const SelectLabel = styled.label`
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

const SelectBorder = styled.span`
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

const SelectBackground = styled.span`
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

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
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
  
  &:focus {
    outline: none;
  }
`;

const SelectValue = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => {
    if (!props.hasValue) return props.theme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)';
    return props.theme.isDark ? '#ffffff' : '#212121';
  }};
  padding: 0 0.75rem;
  font-size: ${props => props.size === 'small' ? '0.875rem' : props.size === 'large' ? '1.125rem' : '1rem'};
`;

const SelectIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 0.75rem;
  color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)'};
  transform: rotate(${props => props.isOpen ? '180deg' : '0deg'});
  transition: transform 0.2s ease;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${props => props.theme.isDark ? '#ffffff' : '#212121'};
  font-size: ${props => 
    props.size === 'small' ? '0.875rem' : 
    props.size === 'large' ? '1.125rem' : 
    '1rem'
  };
  padding: 0 0.75rem;
  
  &::placeholder {
    color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)'};
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const OptionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background-color: ${props => props.theme.isDark ? '#2d2d2d' : '#ffffff'};
  border-radius: 4px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 10;
  margin-top: 4px;
  animation: ${fadeIn} 0.2s ease-out;
  
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
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => 
    props.size === 'small' ? '0.5rem 0.75rem' : 
    props.size === 'large' ? '0.75rem 1rem' : 
    '0.625rem 0.875rem'
  };
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${props => 
    props.selected 
      ? props.theme.isDark ? 'rgba(74, 144, 226, 0.2)' : 'rgba(74, 144, 226, 0.1)'
      : 'transparent'
  };
  
  &:hover {
    background-color: ${props => 
      props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
    };
  }
`;

const OptionLabel = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.isDark ? '#ffffff' : '#212121'};
`;

const OptionCheckmark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.primary || '#4a90e2'};
  margin-left: 0.5rem;
`;

const NoOptions = styled.div`
  padding: 0.75rem;
  text-align: center;
  color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)'};
`;

const HelperText = styled.div`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: ${props => props.error ? props.theme.error || '#ff5252' : props.theme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
`;

export default Select;