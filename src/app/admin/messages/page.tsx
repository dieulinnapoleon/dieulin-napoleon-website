'use client';

import { useEffect, useState, useCallback } from 'react';
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { listDocs, updateDoc, deleteDoc } from '@/lib/admin-api';
import { useToast } from '@/components/ui/toast';
import type { ContactSubmission } from '@/types';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toast = useToast();

  const fetchMessages = useCallback(async () => {
    const data = await listDocs<ContactSubmission>('contactMessages', { field: 'created_at', direction: 'desc' });
    setMessages(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markRead = async (id: string, read: boolean) => { try { await updateDoc('contactMessages', id, { read }); fetchMessages(); } catch (err: any) { toast.error('Failed to update'); } };
  const handleDelete = async (id: string) => { if (!confirm('Delete this message? This cannot be undone.')) return; try { await deleteDoc('contactMessages', id); toast.success('Message deleted'); fetchMessages(); } catch (err: any) { toast.error('Failed to delete'); } };

  const toggleExpand = (id: string) => {
    if (expandedId === id) { setExpandedId(null); }
    else { setExpandedId(id); const msg = messages.find((m) => m.id === id); if (msg && !msg.read) markRead(id, true); }
  };

  const unreadCount = messages.filter((m) => !m.read).length;
  if (loading) return <div className="text-gray-500">Loading messages...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-navy">Messages</h1><p className="text-sm text-gray-500">{messages.length} total · {unreadCount} unread</p></div>
      </div>
      {messages.length === 0 ? (
        <div className="admin-card text-center py-12 text-gray-400"><Mail size={32} className="mx-auto mb-3 opacity-50" /><p>No messages yet.</p></div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => {
            const isOpen = expandedId === msg.id;
            return (
              <div key={msg.id} className={`admin-card transition-colors ${!msg.read ? 'border-l-4 border-l-gold' : ''}`}>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(msg.id)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.read ? 'bg-gray-100' : 'bg-gold-50'}`}>
                      {msg.read ? <MailOpen size={14} className="text-gray-400" /> : <Mail size={14} className="text-gold" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm truncate ${msg.read ? 'text-gray-600' : 'font-semibold text-navy'}`}>{msg.name}</p>
                        <span className="text-xs text-gray-400">·</span><span className="text-xs text-gray-400">{msg.reason}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{msg.email}{msg.organization ? ` · ${msg.organization}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-xs text-gray-400 hidden sm:block">{new Date(msg.created_at).toLocaleDateString()}</span>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                    <div className="grid sm:grid-cols-3 gap-3 mb-4 text-xs">
                      <div><span className="font-semibold text-gray-500 uppercase tracking-wider">From</span><p className="text-navy mt-0.5">{msg.name}</p></div>
                      <div><span className="font-semibold text-gray-500 uppercase tracking-wider">Email</span><p className="text-navy mt-0.5">{msg.email}</p></div>
                      <div><span className="font-semibold text-gray-500 uppercase tracking-wider">Organization</span><p className="text-navy mt-0.5">{msg.organization || '—'}</p></div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 mb-4"><p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p></div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); markRead(msg.id, !msg.read); }} className="text-xs text-gray-500 hover:text-navy flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300">
                        {msg.read ? <Mail size={12} /> : <MailOpen size={12} />} {msg.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <a href={`mailto:${msg.email}?subject=Re: ${msg.reason}`} className="text-xs text-gold hover:text-gold-500 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gold-200 hover:border-gold" onClick={(e) => e.stopPropagation()}>Reply via Email</a>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-100 hover:border-red-300 ml-auto"><Trash2 size={12} /> Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
