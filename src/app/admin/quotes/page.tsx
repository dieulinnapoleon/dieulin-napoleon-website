"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { listDocs, createDoc, updateDoc, deleteDoc } from "@/lib/admin-api";

const CATEGORIES = ['Motivation','Discipline','Hope','Faith','Leadership','Entrepreneurship','Education','Haiti','Resilience','Purpose','Service','Growth','Patriotism','Family','Wisdom'];

const EMPTY = { text: '', author: 'Dieulin Napoleon', source: 'Original', category: '', tags: '', slug: '', scheduledDate: '', sortOrder: 0, published: true, featured: false };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetch = useCallback(async () => {
    try {
      const data = await listDocs('quotes', { field: 'sortOrder' });
      setQuotes(data);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.text.trim()) { toast.error('Quote text is required'); return; }
    setSaving(true);
    try {
      const slug = editing.slug?.trim() || slugify(editing.text);
      const tags = typeof editing.tags === 'string' ? editing.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : editing.tags || [];
      const payload = {
        text: editing.text.trim(),
        author: editing.author?.trim() || 'Dieulin Napoleon',
        source: editing.source?.trim() || 'Original',
        category: editing.category?.trim() || '',
        tags,
        slug,
        language: 'en',
        scheduledDate: editing.scheduledDate || '',
        sortOrder: editing.sortOrder ?? 0,
        published: editing.published ?? true,
        featured: editing.featured ?? false,
      };
      if (editing.id) {
        await updateDoc('quotes', editing.id, payload);
        toast.success('Quote updated');
      } else {
        await createDoc('quotes', payload);
        toast.success('Quote created');
      }
      setEditing(null);
      fetch();
    } catch (err: any) { toast.error(err.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quote?')) return;
    try {
      await deleteDoc('quotes', id);
      toast.success('Quote deleted');
      fetch();
    } catch { toast.error('Failed to delete'); }
  };

  const togglePublish = async (q: any) => {
    try {
      await updateDoc('quotes', q.id, { published: !q.published });
      toast.success(q.published ? 'Unpublished' : 'Published');
      fetch();
    } catch { toast.error('Failed to update'); }
  };

  const toggleFeatured = async (q: any) => {
    try {
      await updateDoc('quotes', q.id, { featured: !q.featured });
      toast.success(q.featured ? 'Unfeatured' : 'Featured');
      fetch();
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="text-gray-500">Loading quotes...</div>;

  if (editing) return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-navy">{editing.id ? 'Edit Quote' : 'New Quote'}</h1>
        <button onClick={() => setEditing(null)} className="text-sm text-gray-400 hover:text-navy">&times; Cancel</button>
      </div>
      <div className="admin-card space-y-5">
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Quote Text <span className="text-red-400">*</span></label>
          <textarea value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} className="input-field" rows={4} placeholder="Your discipline today becomes your freedom tomorrow." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Author</label>
            <input value={editing.author ?? ''} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className="input-field" placeholder="Dieulin Napoleon" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Source</label>
            <input value={editing.source ?? ''} onChange={(e) => setEditing({ ...editing, source: e.target.value })} className="input-field" placeholder="Original, Book, Speech..." />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Category</label>
            <select value={editing.category ?? ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input-field">
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Tags (comma-separated)</label>
            <input value={typeof editing.tags === 'string' ? editing.tags : (editing.tags || []).join(', ')} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} className="input-field" placeholder="discipline, growth, motivation" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Slug (auto if empty)</label>
            <input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input-field" placeholder="auto-generated" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Scheduled Date</label>
            <input type="date" value={editing.scheduledDate ?? ''} onChange={(e) => setEditing({ ...editing, scheduledDate: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Sort Order</label>
            <input type="number" value={editing.sortOrder ?? 0} onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} className="input-field" />
          </div>
        </div>
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
            <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded border-gray-300" /> Published
          </label>
          <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
            <input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="rounded border-gray-300" /> Featured
          </label>
        </div>
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button onClick={handleSave} loading={saving}>Save Quote</Button>
          <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Quotes</h1>
          <p className="text-sm text-gray-500">{quotes.length} quote(s)</p>
        </div>
        <Button onClick={() => setEditing({ ...EMPTY })}><Plus size={16} /> Add Quote</Button>
      </div>
      <div className="space-y-3">
        {quotes.map((q: any) => (
          <div key={q.id} className="admin-card flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-navy font-medium italic leading-relaxed line-clamp-2">&ldquo;{q.text}&rdquo;</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-gold font-medium">{q.author || 'Dieulin Napoleon'}</span>
                {q.category && <span className="text-[10px] bg-navy/5 text-navy/50 px-2 py-0.5 rounded-full">{q.category}</span>}
                {q.scheduledDate && <span className="text-[10px] text-gray-400 flex items-center gap-1"><Calendar size={10} /> {q.scheduledDate}</span>}
                {!q.published && <span className="text-[10px] text-red-400">Draft</span>}
                {q.featured && <Star size={12} className="text-gold fill-gold" />}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => toggleFeatured(q)} className="p-1.5 rounded-lg hover:bg-gray-50" title="Toggle featured"><Star size={14} className={q.featured ? 'text-gold fill-gold' : 'text-gray-300'} /></button>
              <button onClick={() => togglePublish(q)} className="p-1.5 rounded-lg hover:bg-gray-50" title="Toggle publish">{q.published ? <Eye size={14} className="text-emerald-500" /> : <EyeOff size={14} className="text-gray-300" />}</button>
              <button onClick={() => setEditing({ ...q, tags: (q.tags || []).join(', ') })} className="p-1.5 rounded-lg hover:bg-gray-50" title="Edit"><Pencil size={14} className="text-gray-400" /></button>
              <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded-lg hover:bg-red-50" title="Delete"><Trash2 size={14} className="text-red-300" /></button>
            </div>
          </div>
        ))}
        {quotes.length === 0 && <p className="text-sm text-gray-400 py-8 text-center">No quotes yet. Add your first one!</p>}
      </div>
    </div>
  );
}
