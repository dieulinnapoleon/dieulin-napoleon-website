'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listDocs, createDoc, updateDoc, deleteDoc } from '@/lib/admin-api';
import { useToast } from '@/components/ui/toast';
import type { MediaItem } from '@/types';

const EMPTY: Partial<MediaItem> = {
  title: '', description: '', type: 'platform', url: '', date: '', sort_order: 0,
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [editing, setEditing] = useState<Partial<MediaItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchItems = useCallback(async () => {
    const data = await listDocs<MediaItem>('mediaItems', { field: 'sort_order' });
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const startEdit = (item?: MediaItem) => setEditing(item ?? { ...EMPTY });

  const handleSave = async () => {
    if (!editing?.title) return;
    setSaving(true);
    const payload = {
      title: editing.title,
      description: editing.description ?? '',
      type: editing.type ?? 'platform',
      url: editing.url ?? '',
      date: editing.date ?? '',
      sort_order: editing.sort_order ?? 0,
    };
    if (editing.id) {
      await updateDoc('mediaItems', editing.id, payload);
    } else {
      await createDoc('mediaItems', payload);
    }
    setSaving(false);
    setEditing(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media item?')) return;
    await deleteDoc('mediaItems', id);
    fetchItems();
  };

  if (loading) return <div className="text-gray-500">Loading media items...</div>;

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-navy">{editing.id ? 'Edit Media Item' : 'New Media Item'}</h1>
          <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        <div className="admin-card space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Title</label>
            <input value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Description</label>
            <textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input-field" rows={2} />
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Type</label>
              <select value={editing.type ?? 'platform'} onChange={(e) => setEditing({ ...editing, type: e.target.value as MediaItem['type'] })} className="input-field">
                <option value="award">Award</option>
                <option value="press">Press</option>
                <option value="speaking">Speaking</option>
                <option value="platform">Platform</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Date</label>
              <input value={editing.date ?? ''} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="input-field" placeholder="e.g., 2025" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Sort Order</label>
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">URL (optional)</label>
            <input value={editing.url ?? ''} onChange={(e) => setEditing({ ...editing, url: e.target.value })} className="input-field" placeholder="https://..." />
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button onClick={handleSave} loading={saving}><Save size={16} /> Save</Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Media Items</h1>
          <p className="text-sm text-gray-500">{items.length} items</p>
        </div>
        <Button onClick={() => startEdit()}><Plus size={16} /> New Item</Button>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Type</th><th>Date</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="font-medium text-navy text-sm">{item.title}</td>
                <td><span className="category-badge">{item.type}</span></td>
                <td className="text-xs text-gray-500">{item.date || '—'}</td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No media items yet.</p>}
      </div>
    </div>
  );
}
