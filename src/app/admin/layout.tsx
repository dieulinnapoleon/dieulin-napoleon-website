'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, FolderKanban, Briefcase, GraduationCap,
  MessageSquare, Settings, Link2, LogOut, Image, Quote, BookOpen, Mic, Mail, MessageCircle, Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFirebaseClient } from '@/lib/firebase-client';
import { signOut } from 'firebase/auth';
import { ToastProvider } from '@/components/ui/toast';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'CV', href: '/admin/cv', icon: GraduationCap },
  { label: 'Services', href: '/admin/services', icon: Briefcase },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Media', href: '/admin/media', icon: Image },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
  { label: 'Books', href: '/admin/books', icon: BookOpen },
  { label: 'Events', href: '/admin/events', icon: Mic },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { label: 'Quotes', href: '/admin/quotes', icon: MessageCircle },
  { label: 'Haiti 2077', href: '/admin/haiti-2077', icon: Globe },
  { label: 'Social Links', href: '/admin/settings', icon: Link2 },
  { label: 'Settings', href: '/admin/site-settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = async () => {
    try {
      const { auth } = getFirebaseClient();
      await signOut(auth);
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <aside className="w-64 bg-navy fixed top-0 left-0 h-full flex flex-col z-40">
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-display font-bold text-sm text-white">
                DN
              </div>
              <div>
                <p className="font-display font-semibold text-white text-sm">Admin Panel</p>
                <p className="text-[10px] text-gold">dieulinnapoleon.com</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn('admin-sidebar-link', pathname === item.href && 'active')}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="admin-sidebar-link w-full text-red-300 hover:text-red-200 hover:bg-red-500/10">
              <LogOut size={18} />
              Sign Out
            </button>
            <Link href="/" className="admin-sidebar-link mt-1 text-white/30 hover:text-white/60">
              ← View Site
            </Link>
          </div>
        </aside>

        <div className="flex-1 ml-64">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </ToastProvider>
  );
}
