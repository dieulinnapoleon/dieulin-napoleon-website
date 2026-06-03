"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Save, X, AlertCircle, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { listDocs, createDoc, updateDoc, deleteDoc } from "@/lib/admin-api";
import type { Testimonial } from "@/types";

const EMPTY: Partial<Testimonial> = {
  name: "", title: "", organization: "", quote: "", sort_order: 0, published: true,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const toast = useToast();

  const fetchItems = useCallback(async () => {
    try { setItems(await listDocs<Testimonial>("testimonials", { field: "sort_order" })); }
    catch { toast.error("Failed to load testimonials"); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  const startEdit = (item?: Testimonial) => { setEditing(item ?? { ...EMPTY }); setErrors([]); };

  const validate = (): boolean => {
    const e: string[] = [];
    if (!editing?.name?.trim()) e.push("Name is required");
    if (!editing?.quote?.trim()) e.push("Quote is required");
    setErrors(e);
    return e.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = { name: editing!.name!.trim(), title: editing!.title?.trim() ?? "", organization: editing!.organization?.trim() ?? "", quote: editing!.quote!.trim(), sort_order: editing!.sort_order ?? 0, published: editing!.published ?? true };
    try {
      if (editing!.id) { await updateDoc("testimonials", editing!.id, payload); toast.success("Testimonial updated"); }
      else { await createDoc("testimonials", payload); toast.success("Testimonial created"); }
      setEditing(null); fetchItems();
    } catch (err: any) { toast.error(err.message || "Failed to save"); }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm("Delete testimonial from " + name + "?")) return;
    try { await deleteDoc("testimonials", id); toast.success("Testimonial deleted"); fetchItems(); }
    catch (err: any) { toast.error(err.message || "Failed to delete"); }
  };

  if (loading) return <div className="text-gray-500">Loading testimonials...</div>;

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-navy">{editing.id ? "Edit Testimonial" : "New Testimonial"}</h1>
          <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            {errors.map((err, i) => (<p key={i} className="text-sm text-red-700 flex items-center gap-2"><AlertCircle size={14} /> {err}</p>))}
          </div>
        )}
        <div className="admin-card space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-medium text-navy mb-1">Name <span className="text-red-400">*</span></label><input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-field" placeholder="Dr. Jane Smith" /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Title</label><input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input-field" placeholder="Professor of Finance" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-medium text-navy mb-1">Organization</label><input value={editing.organization ?? ""} onChange={(e) => setEditing({ ...editing, organization: e.target.value })} className="input-field" placeholder="Colorado State University" /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Sort Order</label><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="input-field" /></div>
          </div>
          <div><label className="block text-sm font-medium text-navy mb-1">Quote <span className="text-red-400">*</span></label><textarea value={editing.quote ?? ""} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} className="input-field" rows={4} placeholder="What they said about you..." /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded border-gray-300" /> Published</label>
          <div className="flex gap-3 pt-4 border-t border-gray-100"><Button onClick={handleSave} loading={saving}><Save size={16} /> Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-navy">Testimonials</h1><p className="text-sm text-gray-500">{items.length} testimonials</p></div>
        <Button onClick={() => startEdit()}><Plus size={16} /> New Testimonial</Button>
      </div>
      <div className="admin-card">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400"><Quote size={24} className="mx-auto mb-2 opacity-50" /><p className="text-sm">No testimonials yet. Add your first one!</p></div>
        ) : (
          <div className="space-y-3">{items.map((item) => (
            <div key={item.id} className="flex items-start justify-between p-4 rounded-xl hover:bg-gray-50 border border-gray-100">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm text-gray-600 italic mb-2">&ldquo;{item.quote.substring(0, 100)}...&rdquo;</p>
                <p className="text-xs font-medium text-navy">{item.name} <span className="text-gray-400">— {item.organization}</span></p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}</div>
        )}
      </div>
    </div>
  );
}
