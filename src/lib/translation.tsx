'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Locale } from '@/types';

import en from '@/i18n/en/common.json';
import fr from '@/i18n/fr/common.json';
import es from '@/i18n/es/common.json';
import ht from '@/i18n/ht/common.json';

const translations: Record<Locale, Record<string, any>> = { en, fr, es, ht };

const GOOGLE_LANG_MAP: Record<Locale, string> = {
  en: 'en',
  fr: 'fr',
  es: 'es',
  ht: 'ht',
};

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

function lookup(obj: Record<string, any>, key: string): string {
  const parts = key.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return key;
    current = current[part];
  }
  return typeof current === 'string' ? current : key;
}

/** Trigger Google Translate to translate the page */
function triggerGoogleTranslate(langCode: string) {
  // If switching back to English, remove translation
  if (langCode === 'en') {
    const frame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
    if (frame) {
      const btn = frame.contentDocument?.querySelector('.goog-close-link') as HTMLAnchorElement;
      if (btn) btn.click();
    }
    // Also try the cookie approach
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'googtrans=; path=/; domain=.' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.reload();
    return;
  }

  // Set the translation cookie
  const value = '/en/' + langCode;
  document.cookie = 'googtrans=' + value + '; path=/';
  document.cookie = 'googtrans=' + value + '; path=/; domain=.' + window.location.hostname;

  // If Google Translate element exists, trigger it
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event('change'));
  } else {
    // If not loaded yet, reload to apply cookie
    window.location.reload();
  }
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = document.cookie
      .split('; ')
      .find((row) => row.startsWith('locale='))
      ?.split('=')[1] as Locale | undefined;
    if (stored && translations[stored]) {
      setLocaleState(stored);
    }

    // Load Google Translate script
    if (!document.getElementById('google-translate-script')) {
      (window as any).googleTranslateElementInit = function () {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,fr,es,ht',
            autoDisplay: false,
            layout: (window as any).google.translate.TranslateElement.InlineLayout?.SIMPLE,
          },
          'google_translate_element'
        );
      };
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = 'locale=' + newLocale + '; path=/; max-age=' + (365 * 24 * 60 * 60);
    // Trigger Google Translate for page content
    triggerGoogleTranslate(GOOGLE_LANG_MAP[newLocale]);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const result = lookup(translations[locale], key);
      if (result !== key) return result;
      return lookup(translations.en, key);
    },
    [locale]
  );

  return (
    <TranslationContext.Provider value={{ locale, t, setLocale }}>
      {children}
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" style={{ position: 'absolute', top: -9999, left: -9999, visibility: 'hidden' }} />
    </TranslationContext.Provider>
  );
}
