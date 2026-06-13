import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('uz');

  useEffect(() => {
    AsyncStorage.getItem('app_language').then((saved) => {
      if (saved && TRANSLATIONS[saved]) setLangState(saved);
    });
  }, []);

  const setLang = async (newLang) => {
    setLangState(newLang);
    await AsyncStorage.setItem('app_language', newLang);
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
