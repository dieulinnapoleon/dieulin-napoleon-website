'use client';

import Link from 'next/link';
import { Linkedin, Github, Mail, Globe } from 'lucide-react';
import { useTranslation } from '@/lib/translation';
import { FALLBACK_SOCIAL } from '@/lib/fallback-data';

const FOOTER_NAV_KEYS = [
  { key: 'about', href: '/about' },
  { key: 'cv', href: '/cv' },
  { key: 'projects', href: '/projects' },
  { key: 'insights', href: '/insights' },
  { key: 'services', href: '/services' },
  { key: 'contact', href: '/contact' },
];

const VENTURES = ['Creasti', 'FINANCEM', 'PATRIYA', 'LINEON Group', 'ReSource Haiti'];

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-navy text-white/60">
      <div className="section-container pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center font-display font-bold text-sm text-white">
                DN
              </div>
              <div>
                <p className="font-display font-semibold text-white text-[15px]">Dieulin Napoleon</p>
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gold">
                  {t('hero.tagline')}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mt-4">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm mb-4">{t('footer.navigate')}</h3>
            <ul className="space-y-2">
              {FOOTER_NAV_KEYS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-gold transition-colors">
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ventures */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm mb-4">{t('footer.ventures')}</h3>
            <ul className="space-y-2">
              {VENTURES.map((v) => (
                <li key={v} className="text-sm">{v}</li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm mb-4">{t('sections.connect')}</h3>
            <div className="flex gap-3 mb-4">
              {FALLBACK_SOCIAL.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold/20 hover:border-gold/30 hover:text-gold transition-all"
                  aria-label={social.platform}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
            <Link href="/admin/login" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Admin
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Dieulin Napoleon. {t('footer.copyright')}
          </p>
          <p className="text-xs text-white/20">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return <Linkedin size={16} />;
  if (p.includes('github')) return <Github size={16} />;
  if (p.includes('mail') || p.includes('email')) return <Mail size={16} />;
  return <Globe size={16} />;
}
