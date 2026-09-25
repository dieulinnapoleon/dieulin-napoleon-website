'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './language-switcher';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';
import { useTranslation } from '@/lib/translation';

const NAV_KEYS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'finance', href: '/#finance-in-practice' },
  { key: 'insights', href: '/insights' },
  { key: 'services', href: '/services' },
  { key: 'haiti2077', href: '/haiti-2077' },
];

const MORE_KEYS = [
  { key: 'cv', href: '/cv' },
  { key: 'projects', href: '/projects' },
  { key: 'speaking', href: '/speaking' },
  { key: 'books', href: '/books' },
  { key: 'media', href: '/media' },
  { key: 'quotes', href: '/quotes' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      )}
    >
      <nav className="section-container flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm transition-colors',
            scrolled ? 'bg-navy text-white' : 'bg-white/10 text-white border border-white/20'
          )}>
            DN
          </div>
          <div>
            <p className={cn(
              'font-display font-semibold text-[15px] leading-tight transition-colors',
              scrolled ? 'text-navy' : 'text-white'
            )}>
              Dieulin Napoleon
            </p>
            <p className={cn(
              'text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors',
              scrolled ? 'text-gold' : 'text-gold-300'
            )}>
              Finance · Impact · Strategy
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_KEYS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-2 text-[13px] font-medium rounded-lg transition-colors',
                isActive(link.href)
                  ? scrolled ? 'text-gold bg-gold-50' : 'text-gold bg-white/10'
                  : scrolled ? 'text-gray-600 hover:text-navy hover:bg-gray-50' : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              <span className="whitespace-nowrap">{t(`nav.${link.key}`)}</span>
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-2 px-4 py-2 rounded-lg bg-gold hover:bg-gold-300 text-white text-[13px] font-semibold whitespace-nowrap transition-colors"
          >
            {t('nav.contact')}
          </Link>

          <div className="ml-3 pl-3 border-l border-gray-200/30 flex items-center gap-1">
            <DarkModeToggle scrolled={scrolled} />
            <LanguageSwitcher scrolled={scrolled} />
          </div>
        </div>

        {/* Mobile Language Button */}
        <div className="lg:hidden ml-auto mr-1">
          <LanguageSwitcher scrolled={scrolled} />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            'lg:hidden p-2 rounded-lg transition-colors',
            scrolled ? 'text-navy hover:bg-gray-100' : 'text-white hover:bg-white/10'
          )}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl animate-fade-in">
          <div className="section-container py-4 space-y-1">
            <div className="px-4 pb-4 mb-2 border-b border-gray-100">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-2">Language</p>
              <LanguageSwitcher scrolled={true} variant="inline" />
            </div>
            {NAV_KEYS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-gold bg-gold-50'
                    : 'text-gray-600 hover:text-navy hover:bg-gray-50'
                )}
              >
                <span className="whitespace-nowrap">{t(`nav.${link.key}`)}</span>
              </Link>
            ))}
            <Link
              href="/contact"
              className="block mt-2 px-4 py-3 rounded-xl bg-gold hover:bg-gold-300 text-white text-sm font-semibold text-center transition-colors"
            >
              {t('nav.contact')}
            </Link>
            <div className="pt-4 mt-3 border-t border-gray-100 px-4">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-2">More</p>
              <div className="flex flex-wrap gap-2">
                {MORE_KEYS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs px-3 py-2 rounded-lg bg-gray-50 text-gray-600 hover:text-navy hover:bg-gray-100 transition-colors"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
