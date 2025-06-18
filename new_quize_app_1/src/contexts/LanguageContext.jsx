import { createContext, useContext, useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/storage';

// Import language files
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';
import frTranslations from '../locales/fr.json';
import deTranslations from '../locales/de.json';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  // Available languages
  const languages = [
    { code: 'en', name: 'English', translations: enTranslations },
    { code: 'es', name: 'Español', translations: esTranslations },
    { code: 'fr', name: 'Français', translations: frTranslations },
    { code: 'de', name: 'Deutsch', translations: deTranslations },
  ];
  
  // Get saved language or default to browser language or English
  const getSavedLanguage = () => {
    const savedLang = getFromLocalStorage('language');
    if (savedLang) {
      return savedLang;
    }
    
    // Try to match browser language
    const browserLang = navigator.language.split('-')[0];
    const matchedLang = languages.find(lang => lang.code === browserLang);
    
    return matchedLang ? browserLang : 'en';
  };
  
  const [currentLanguage, setCurrentLanguage] = useState(getSavedLanguage());
  const [translations, setTranslations] = useState(
    languages.find(lang => lang.code === getSavedLanguage())?.translations || enTranslations
  );
  
  // Change language
  const changeLanguage = (langCode) => {
    const language = languages.find(lang => lang.code === langCode);
    if (language) {
      setCurrentLanguage(langCode);
      setTranslations(language.translations);
      saveToLocalStorage('language', langCode);
    }
  };
  
  // Translate function
  const t = (key, params = {}) => {
    let text = translations[key] || key;
    
    // Replace parameters in the text
    Object.keys(params).forEach(param => {
      text = text.replace(`{{${param}}}`, params[param]);
    });
    
    return text;
  };
  
  const value = {
    currentLanguage,
    languages,
    changeLanguage,
    t,
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;