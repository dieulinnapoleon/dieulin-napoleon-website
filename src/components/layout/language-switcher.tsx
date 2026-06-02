'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LOCALES, type Locale } from '@/types';
import { useTranslation } from '@/lib/translation';

interface Props {
  scrolled: boolean;
}

export function LanguageSwitcher({ scrolled }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { locale, setLocale } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setOpen(false);
  };

  const current = LOCALES.find(l => l.code === locale)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors',
          scrolled
            ? 'text-gray-500 hover:text-navy hover:bg-gray-50'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        )}
        aria-label="Change language"
      >
        <Globe size={14} />
        <span>{current.flag} {current.code.toUpperCase()}</span>
        <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[180px] animate-fade-in z-50">
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              onClick={() => switchLocale(loc.code)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                loc.code === locale
                  ? 'text-gold bg-gold-50 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <span className="text-base">{loc.flag}</span>
              <span>{loc.nativeName}</span>
              {loc.code === locale && (
                <span className="ml-auto text-gold text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
