'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Locale } from '@/types';

// Import all translation files statically (required for client-side bundles)
import en from '@/i18n/en/common.json';
import fr from '@/i18n/fr/common.json';
import es from '@/i18n/es/common.json';
import ht from '@/i18n/ht/common.json';

const translations: Record<Locale, Record<string, any>> = { en, fr, es, ht };

interface TranslationContextValue {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextValue>({
  locale: 'en',
  t: (key) => key,
  setLocale: () => {},
});

export function useTranslation() {
  return useContext(TranslationContext);
}

/**
 * Look up a dot-separated key like "nav.home" in the translations object.
 * Returns the key itself if not found (safe fallback).
 */
function lookup(obj: Record<string, any>, key: string): string {
  const parts = key.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return key;
    current = current[part];
  }
  return typeof current === 'string' ? current : key;
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Read locale from cookie on mount
  useEffect(() => {
    const stored = document.cookie
      .split('; ')
      .find((row) => row.startsWith('locale='))
      ?.split('=')[1] as Locale | undefined;
    if (stored && translations[stored]) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}`;
  }, []);

  const t = useCallback(
    (key: string): string => {
      // Try the current locale first, fall back to English
      const result = lookup(translations[locale], key);
      if (result !== key) return result;
      return lookup(translations.en, key);
    },
    [locale]
  );

  return (
    <TranslationContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
}
