'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { listDocs, createDoc, updateDoc, deleteDoc } from '@/lib/admin-api';
import { slugify } from '@/lib/utils';
import type { Project } from '@/types';

const CATEGORIES = ['Startups', 'Finance & Investment', 'Civic Innovation', 'Haiti-focused Ventures', 'Sustainability / ESG'];

const EMPTY: Partial<Project> = {
  title: '', slug: '', category: 'Startups', description: '', problem: '', solution: '',
  role: '', status: 'In Progress', tech: [], impact: '', url: '', sort_order: 0, published: true,
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const toast = useToast();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchItems = useCallback(async () => {
    try {
      const data = await listDocs<Project>('projects', { field: 'sort_order' });
      setItems(data);
    } catch { toast.error('Failed to load projects'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const startEdit = (item?: Project) => {
    const p = item ?? { ...EMPTY };
    setEditing(p);
    setTechInput((p.tech ?? []).join(', '));
    setErrors([]);
  };

  const validate = (): boolean => {
    const e: string[] = [];
    if (!editing?.title?.trim()) e.push('Title is required');
    if (!editing?.description?.trim()) e.push('Description is required');
    if (!editing?.role?.trim()) e.push('Role is required');
    setErrors(e);
    return e.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const slug = editing!.slug?.trim() || slugify(editing!.title!);
    const payload = {
      title: editing!.title!.trim(), slug, category: editing!.category ?? 'Startups',
      description: editing!.description?.trim() ?? '', problem: editing!.problem?.trim() ?? '',
      solution: editing!.solution?.trim() ?? '', role: editing!.role?.trim() ?? '',
      status: editing!.status ?? 'In Progress',
      tech: techInput.split(',').map((t) => t.trim()).filter(Boolean),
      impact: editing!.impact?.trim() ?? '', url: editing!.url?.trim() ?? '', image_url: editing!.image_url?.trim() ?? '',
      sort_order: editing!.sort_order ?? 0, published: editing!.published ?? true,
    };
    try {
      if (editing!.id) { await updateDoc('projects', editing!.id, payload); toast.success('Project updated'); }
      else { await createDoc('projects', payload); toast.success('Project created'); }
      setEditing(null); fetchItems();
    } catch (err: any) { toast.error(err.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try { await deleteDoc('projects', id); toast.success('Project deleted'); fetchItems(); }
    catch (err: any) { toast.error(err.message || 'Failed to delete'); }
  };

  if (loading) return <div className="text-gray-500">Loading projects...</div>;

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-navy">{editing.id ? 'Edit Project' : 'New Project'}</h1>
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
            <div><label className="block text-sm font-medium text-navy mb-1">Slug</label><input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input-field" placeholder="auto-generated" /></div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div><label className="block text-sm font-medium text-navy mb-1">Category</label>
              <select value={editing.category ?? ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input-field">
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Status</label><input value={editing.status ?? ''} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Role <span className="text-red-400">*</span></label><input value={editing.role ?? ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="input-field" /></div>
          </div>
          <div><label className="block text-sm font-medium text-navy mb-1">Description <span className="text-red-400">*</span></label><textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input-field" rows={3} /></div>
          <div><label className="block text-sm font-medium text-navy mb-1">Problem</label><textarea value={editing.problem ?? ''} onChange={(e) => setEditing({ ...editing, problem: e.target.value })} className="input-field" rows={2} /></div>
          <div><label className="block text-sm font-medium text-navy mb-1">Solution</label><textarea value={editing.solution ?? ''} onChange={(e) => setEditing({ ...editing, solution: e.target.value })} className="input-field" rows={2} /></div>
          <div><label className="block text-sm font-medium text-navy mb-1">Tech Stack (comma-separated)</label><input value={techInput} onChange={(e) => setTechInput(e.target.value)} className="input-field" />
            {techInput && <div className="flex flex-wrap gap-1.5 mt-2">{techInput.split(',').map((t) => t.trim()).filter(Boolean).map((tag, i) => (<span key={i} className="px-2 py-0.5 bg-navy/5 text-navy text-xs rounded-md">{tag}</span>))}</div>}
          </div>
          <div><label className="block text-sm font-medium text-navy mb-1">Impact</label><textarea value={editing.impact ?? ''} onChange={(e) => setEditing({ ...editing, impact: e.target.value })} className="input-field" rows={2} /></div>
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-medium text-navy mb-1">Logo / Image URL</label><input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="input-field" placeholder="/images/projects/logo.png or https://..." /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">URL</label><input value={editing.url ?? ''} onChange={(e) => setEditing({ ...editing, url: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Sort Order</label><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="input-field" /></div>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded border-gray-300" /> Published</label>
          <div className="flex gap-3 pt-4 border-t border-gray-100"><Button onClick={handleSave} loading={saving}><Save size={16} /> Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-navy">Projects</h1><p className="text-sm text-gray-500">{items.length} projects</p></div>
        <Button onClick={() => startEdit()}><Plus size={16} /> New Project</Button>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
          <tbody>{items.map((item) => (
            <tr key={item.id}>
              <td className="font-medium text-navy text-sm">{item.title}</td>
              <td><span className="category-badge">{item.category}</span></td>
              <td><span className="text-xs text-gray-500">{item.status}</span></td>
              <td><div className="flex items-center justify-end gap-1">
                <button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(item.id, item.title)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {items.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No projects yet.</p>}
      </div>
    </div>
  );
}
