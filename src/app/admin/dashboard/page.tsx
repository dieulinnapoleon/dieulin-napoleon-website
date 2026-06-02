'use client';

import { useEffect, useState } from 'react';
import { FileText, FolderKanban, MessageSquare, Eye } from 'lucide-react';
import { listDocs } from '@/lib/admin-api';

interface Stats {
  posts: number;
  projects: number;
  messages: number;
  unread: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ posts: 0, projects: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [posts, projects, messages] = await Promise.all([
          listDocs('blogPosts'),
          listDocs('projects'),
          listDocs('contactMessages'),
        ]);
        setStats({
          posts: posts.length,
          projects: projects.length,
          messages: messages.length,
          unread: (messages as any[]).filter((m) => !m.read).length,
        });
      } catch (err) {
        console.error('Dashboard stats error:', err);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Blog Posts', value: stats.posts, icon: FileText, color: 'bg-blue-50 text-blue-600' },
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'bg-emerald/10 text-emerald' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'bg-purple-50 text-purple-600' },
    { label: 'Unread', value: stats.unread, icon: Eye, color: 'bg-gold-50 text-gold' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy mb-2">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Welcome back. Here is an overview of your site.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="admin-card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{loading ? '—' : card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2 className="font-display text-lg font-semibold text-navy mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'New Blog Post', href: '/admin/blog' },
            { label: 'Add Project', href: '/admin/projects' },
            { label: 'View Messages', href: '/admin/messages' },
            { label: 'Edit CV', href: '/admin/cv' },
          ].map((action) => (
            <a key={action.label} href={action.href}
              className="p-4 rounded-xl border border-gray-200 text-center text-sm font-medium text-navy hover:border-gold hover:bg-gold-50 transition-colors">
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
