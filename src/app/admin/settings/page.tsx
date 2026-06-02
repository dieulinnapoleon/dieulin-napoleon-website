'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Save, X, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listDocs, createDoc, updateDoc, deleteDoc } from '@/lib/admin-api';
import { useToast } from '@/components/ui/toast';
import type { SocialLink } from '@/types';

const EMPTY: Partial<SocialLink> = {
  platform: '', url: '', icon: '', sort_order: 0,
};

export default function AdminSettingsPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [editing, setEditing] = useState<Partial<SocialLink> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchLinks = useCallback(async () => {
    const data = await listDocs<SocialLink>('socialLinks', { field: 'sort_order' });
    setLinks(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  const startEdit = (item?: SocialLink) => setEditing(item ?? { ...EMPTY });

  const handleSave = async () => {
    if (!editing?.platform || !editing?.url) return;
    setSaving(true);
    const payload = {
      platform: editing.platform,
      url: editing.url,
      icon: editing.icon ?? '',
      sort_order: editing.sort_order ?? 0,
    };
    if (editing.id) {
      await updateDoc('socialLinks', editing.id, payload);
    } else {
      await createDoc('socialLinks', payload);
    }
    setSaving(false);
    setEditing(null);
    fetchLinks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link?')) return;
    await deleteDoc('socialLinks', id);
    fetchLinks();
  };

  if (loading) return <div className="text-gray-500">Loading social links...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Social Links</h1>
          <p className="text-sm text-gray-500">Manage links displayed in the footer and elsewhere</p>
        </div>
        <Button onClick={() => startEdit()}><Plus size={16} /> Add Link</Button>
      </div>

      {editing && (
        <div className="admin-card mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-navy">
              {editing.id ? 'Edit Link' : 'New Link'}
            </h2>
            <button onClick={() => setEditing(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Platform</label>
              <select value={editing.platform ?? ''} onChange={(e) => setEditing({ ...editing, platform: e.target.value })} className="input-field">
                <option value="">Select...</option>
                {['LinkedIn', 'GitHub', 'Twitter / X', 'Blog', 'Email', 'Website', 'YouTube', 'Instagram'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">URL</label>
              <input value={editing.url ?? ''} onChange={(e) => setEditing({ ...editing, url: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Icon (optional CSS class)</label>
              <input value={editing.icon ?? ''} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="input-field" placeholder="linkedin, github, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Sort Order</label>
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="input-field" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} loading={saving}><Save size={14} /> Save</Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="admin-card">
        {links.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Link2 size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No social links configured yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
                    <Link2 size={14} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">{link.platform}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[300px]">{link.url}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(link)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(link.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
