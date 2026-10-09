import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getTranslation } from '../utils/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'bn',
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('smart_khulna_lang') || localStorage.getItem('lang');
      if (stored === 'en' || stored === 'bn') {
        return stored;
      }
    } catch {
      // ignore storage access issues
    }
    return 'bn';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('smart_khulna_lang', newLang);
      localStorage.setItem('lang', newLang);
    } catch {
      // ignore storage access issues
    }
  };

  const toggleLang = () => {
    const nextLang = lang === 'bn' ? 'en' : 'bn';
    setLang(nextLang);
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(key, lang, fallback);
  };

  useEffect(() => {
    // Keep document attributes in sync
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
