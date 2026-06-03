"use client";

import { useEffect, useState } from "react";
import { FileText, FolderKanban, Briefcase, MessageSquare, Mail, BookOpen, Mic, Users, Quote } from "lucide-react";
import { listDocs } from "@/lib/admin-api";

interface Stats {
  label: string;
  count: number;
  icon: any;
  color: string;
  href: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentSubscribers, setRecentSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [posts, projects, services, messages, media, socials, testimonials, books, events, subscribers] = await Promise.all([
          listDocs("blogPosts").catch(() => []),
          listDocs("projects").catch(() => []),
          listDocs("services").catch(() => []),
          listDocs("contactMessages", { field: "created_at", direction: "desc" }).catch(() => []),
          listDocs("mediaItems").catch(() => []),
          listDocs("socialLinks").catch(() => []),
          listDocs("testimonials").catch(() => []),
          listDocs("books").catch(() => []),
          listDocs("events").catch(() => []),
          listDocs("newsletterSubscribers", { field: "subscribed_at", direction: "desc" }).catch(() => []),
        ]);

        setStats([
          { label: "Blog Posts", count: posts.length, icon: FileText, color: "bg-blue-50 text-blue-600", href: "/admin/blog" },
          { label: "Projects", count: projects.length, icon: FolderKanban, color: "bg-emerald-50 text-emerald-600", href: "/admin/projects" },
          { label: "Services", count: services.length, icon: Briefcase, color: "bg-purple-50 text-purple-600", href: "/admin/services" },
          { label: "Messages", count: messages.length, icon: MessageSquare, color: "bg-amber-50 text-amber-600", href: "/admin/messages" },
          { label: "Subscribers", count: subscribers.length, icon: Mail, color: "bg-rose-50 text-rose-600", href: "/admin/dashboard" },
          { label: "Testimonials", count: testimonials.length, icon: Quote, color: "bg-cyan-50 text-cyan-600", href: "/admin/testimonials" },
          { label: "Books", count: books.length, icon: BookOpen, color: "bg-orange-50 text-orange-600", href: "/admin/books" },
          { label: "Events", count: events.length, icon: Mic, color: "bg-indigo-50 text-indigo-600", href: "/admin/events" },
        ]);

        setRecentMessages(messages.slice(0, 5));
        setRecentSubscribers(subscribers.slice(0, 5));
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-gray-500">Loading dashboard...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your website content and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <a key={s.label} href={s.href} className="admin-card flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className={"w-11 h-11 rounded-xl flex items-center justify-center " + s.color}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{s.count}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="admin-card">
          <h2 className="font-display text-base font-semibold text-navy mb-4">Recent Messages</h2>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg: any) => (
                <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <MessageSquare size={16} className="text-gold mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{msg.name || "Anonymous"}</p>
                    <p className="text-xs text-gray-400 truncate">{msg.message?.substring(0, 80) || msg.reason || "No message"}</p>
                    <p className="text-[10px] text-gray-300 mt-1">{msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Subscribers */}
        <div className="admin-card">
          <h2 className="font-display text-base font-semibold text-navy mb-4">Recent Newsletter Subscribers</h2>
          {recentSubscribers.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No subscribers yet</p>
          ) : (
            <div className="space-y-3">
              {recentSubscribers.map((sub: any) => (
                <div key={sub.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Mail size={16} className="text-gold shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-navy truncate">{sub.email}</p>
                    <p className="text-[10px] text-gray-300">{sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleDateString() : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
