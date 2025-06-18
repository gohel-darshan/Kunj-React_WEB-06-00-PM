import { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, languages, changeLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  
  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    setSelectedLanguage(langCode);
    changeLanguage(langCode);
  };
  
  return (
    <SelectorContainer>
      <SelectorLabel>{t('settings.language')}</SelectorLabel>
      <SelectWrapper>
        <Select value={selectedLanguage} onChange={handleLanguageChange}>
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </Select>
      </SelectWrapper>
    </SelectorContainer>
  );
};

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const SelectorLabel = styled.label`
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const SelectWrapper = styled.div`
  position: relative;
  
  &::after {
    content: '▼';
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 0.8rem;
    color: ${props => props.theme.text};
    opacity: 0.7;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

export default LanguageSelector;