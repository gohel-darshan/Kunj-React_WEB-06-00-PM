import { useState } from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';

const DifficultySelector = ({ 
  selectedDifficulty, 
  onChange,
  disabled = false
}) => {
  const { t } = useLanguage();
  
  const difficulties = [
    { id: 'easy', name: t('common.easy'), stars: 1, color: '#4caf50' },
    { id: 'medium', name: t('common.medium'), stars: 2, color: '#ff9800' },
    { id: 'hard', name: t('common.hard'), stars: 3, color: '#f44336' }
  ];
  
  return (
    <SelectorContainer>
      <SelectorLabel>{t('settings.difficulty')}</SelectorLabel>
      <DifficultyOptions>
        {difficulties.map(difficulty => (
          <DifficultyOption 
            key={difficulty.id}
            selected={selectedDifficulty === difficulty.id}
            color={difficulty.color}
            onClick={() => !disabled && onChange(difficulty.id)}
            disabled={disabled}
          >
            <DifficultyName>{difficulty.name}</DifficultyName>
            <Stars>
              {[...Array(3)].map((_, i) => (
                <Star key={i} active={i < difficulty.stars} color={difficulty.color}>
                  <FaStar />
                </Star>
              ))}
            </Stars>
          </DifficultyOption>
        ))}
      </DifficultyOptions>
    </SelectorContainer>
  );
};

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SelectorLabel = styled.label`
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const DifficultyOptions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DifficultyOption = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid ${props => props.selected ? props.color : props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.selected ? `${props.color}10` : 'transparent'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover {
    background-color: ${props => !props.disabled && (props.selected ? `${props.color}20` : `${props.color}10`)};
  }
`;

const DifficultyName = styled.div`
  font-weight: 500;
  font-size: 1rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const Star = styled.div`
  color: ${props => props.active ? props.color : props.theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  font-size: 1.25rem;
`;

export default DifficultySelector;