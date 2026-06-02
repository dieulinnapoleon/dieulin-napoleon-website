'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { listDocs, createDoc, updateDoc, deleteDoc } from '@/lib/admin-api';
import type { Service } from '@/types';

const EMPTY: Partial<Service> = {
  title: '', description: '', for_whom: '', deliverables: '', outcomes: '',
  icon: 'briefcase', sort_order: 0, published: true,
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const toast = useToast();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchItems = useCallback(async () => {
    try { setItems(await listDocs<Service>('services', { field: 'sort_order' })); }
    catch { toast.error('Failed to load services'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  const startEdit = (item?: Service) => { setEditing(item ?? { ...EMPTY }); setErrors([]); };

  const validate = (): boolean => {
    const e: string[] = [];
    if (!editing?.title?.trim()) e.push('Title is required');
    if (!editing?.description?.trim()) e.push('Description is required');
    setErrors(e);
    return e.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = { title: editing!.title!.trim(), description: editing!.description?.trim() ?? '', for_whom: editing!.for_whom?.trim() ?? '', deliverables: editing!.deliverables?.trim() ?? '', outcomes: editing!.outcomes?.trim() ?? '', icon: editing!.icon ?? 'briefcase', sort_order: editing!.sort_order ?? 0, published: editing!.published ?? true };
    try {
      if (editing!.id) { await updateDoc('services', editing!.id, payload); toast.success('Service updated'); }
      else { await createDoc('services', payload); toast.success('Service created'); }
      setEditing(null); fetchItems();
    } catch (err: any) { toast.error(err.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try { await deleteDoc('services', id); toast.success('Service deleted'); fetchItems(); }
    catch (err: any) { toast.error(err.message || 'Failed to delete'); }
  };

  if (loading) return <div className="text-gray-500">Loading services...</div>;

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-navy">{editing.id ? 'Edit Service' : 'New Service'}</h1>
          <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            {errors.map((err, i) => (<p key={i} className="text-sm text-red-700 flex items-center gap-2"><AlertCircle size={14} /> {err}</p>))}
          </div>
        )}
        <div className="admin-card space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-medium text-navy mb-1">Title <span className="text-red-400">*</span></label><input value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input-field" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-navy mb-1">Icon</label>
                <select value={editing.icon ?? 'briefcase'} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="input-field">
                  {['bar-chart', 'file-text', 'rocket', 'clipboard', 'leaf', 'globe', 'briefcase'].map((i) => (<option key={i} value={i}>{i}</option>))}
                </select></div>
              <div><label className="block text-sm font-medium text-navy mb-1">Sort Order</label><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="input-field" /></div>
            </div>
          </div>
          <div><label className="block text-sm font-medium text-navy mb-1">Description <span className="text-red-400">*</span></label><textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input-field" rows={3} /></div>
          <div><label className="block text-sm font-medium text-navy mb-1">For Whom</label><input value={editing.for_whom ?? ''} onChange={(e) => setEditing({ ...editing, for_whom: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-navy mb-1">Deliverables</label><input value={editing.deliverables ?? ''} onChange={(e) => setEditing({ ...editing, deliverables: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-navy mb-1">Outcomes</label><input value={editing.outcomes ?? ''} onChange={(e) => setEditing({ ...editing, outcomes: e.target.value })} className="input-field" /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded border-gray-300" /> Published</label>
          <div className="flex gap-3 pt-4 border-t border-gray-100"><Button onClick={handleSave} loading={saving}><Save size={16} /> Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-navy">Services</h1><p className="text-sm text-gray-500">{items.length} services</p></div>
        <Button onClick={() => startEdit()}><Plus size={16} /> New Service</Button>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Icon</th><th>Order</th><th className="text-right">Actions</th></tr></thead>
          <tbody>{items.map((item) => (
            <tr key={item.id}><td className="font-medium text-navy text-sm">{item.title}</td><td className="text-xs text-gray-500">{item.icon}</td><td className="text-xs text-gray-500">{item.sort_order}</td>
              <td><div className="flex items-center justify-end gap-1"><button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy"><Edit2 size={16} /></button><button onClick={() => handleDelete(item.id, item.title)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button></div></td></tr>
          ))}</tbody>
        </table>
        {items.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No services yet.</p>}
      </div>
    </div>
  );
}
