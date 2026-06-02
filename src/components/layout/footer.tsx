import Link from 'next/link';
import { getSocialLinks } from '@/lib/data';
import { Linkedin, Github, Mail, Globe } from 'lucide-react';

const FOOTER_NAV = [
  { label: 'About', href: '/about' },
  { label: 'CV', href: '/cv' },
  { label: 'Projects', href: '/projects' },
  { label: 'Insights', href: '/insights' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

const VENTURES = [
  'Creasti',
  'FINANCEM',
  'PATRIYA',
  'LINEON Group',
  'ReSource Haiti',
];

export async function Footer() {
  const socials = await getSocialLinks();

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
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gold">Finance · Impact · Strategy</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mt-4">
              Finance professional, entrepreneur, and project strategist building at the intersection of
              capital markets, technology, and social impact.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm mb-4">Navigation</h3>
            <ul className="space-y-2">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ventures */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm mb-4">Ventures</h3>
            <ul className="space-y-2">
              {VENTURES.map((v) => (
                <li key={v} className="text-sm">{v}</li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm mb-4">Connect</h3>
            <div className="flex gap-3 mb-4">
              {socials.map((social) => (
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
            © {new Date().getFullYear()} Dieulin Napoleon. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Built with purpose. Driven by impact.
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
