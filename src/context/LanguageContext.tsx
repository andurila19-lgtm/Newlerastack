'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary, Locale } from '@/lib/dictionaries';

type Dictionary = ReturnType<typeof getDictionary>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLocale }: { children: React.ReactNode, initialLocale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `nwl_locale=${newLocale}; path=/; max-age=31536000`; // 1 year
    router.refresh(); // Refresh server components to use new locale
  };

  useEffect(() => {
    // Sync client state with cookie just in case it differs on initial mount
    const match = document.cookie.match(/(?:^|;\s*)nwl_locale=([^;]*)/);
    const cookieLocale = match ? match[1] as Locale : null;
    if (cookieLocale && cookieLocale !== locale && (cookieLocale === 'id' || cookieLocale === 'en')) {
      setLocaleState(cookieLocale);
    }
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dict: getDictionary(locale) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
