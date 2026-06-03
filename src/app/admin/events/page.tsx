"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Save, X, AlertCircle, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { listDocs, createDoc, updateDoc, deleteDoc } from "@/lib/admin-api";
import type { SpeakingEvent } from "@/types";

const EMPTY: Partial<SpeakingEvent> = {
  title: "", event_name: "", location: "", date: "", description: "", type: "speaking", url: "", sort_order: 0, published: true,
};

export default function AdminEventsPage() {
  const [items, setItems] = useState<SpeakingEvent[]>([]);
  const [editing, setEditing] = useState<Partial<SpeakingEvent> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const toast = useToast();

  const fetchItems = useCallback(async () => {
    try { setItems(await listDocs<SpeakingEvent>("events", { field: "sort_order" })); }
    catch { toast.error("Failed to load events"); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  const startEdit = (item?: SpeakingEvent) => { setEditing(item ?? { ...EMPTY }); setErrors([]); };

  const validate = (): boolean => {
    const e: string[] = [];
    if (!editing?.title?.trim()) e.push("Title is required");
    if (!editing?.event_name?.trim()) e.push("Event name is required");
    setErrors(e);
    return e.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = { title: editing!.title!.trim(), event_name: editing!.event_name!.trim(), location: editing!.location?.trim() ?? "", date: editing!.date?.trim() ?? "", description: editing!.description?.trim() ?? "", type: editing!.type ?? "speaking", url: editing!.url?.trim() ?? "", sort_order: editing!.sort_order ?? 0, published: editing!.published ?? true };
    try {
      if (editing!.id) { await updateDoc("events", editing!.id, payload); toast.success("Event updated"); }
      else { await createDoc("events", payload); toast.success("Event added"); }
      setEditing(null); fetchItems();
    } catch (err: any) { toast.error(err.message || "Failed to save"); }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm('Delete "' + title + '"?')) return;
    try { await deleteDoc("events", id); toast.success("Event deleted"); fetchItems(); }
    catch (err: any) { toast.error(err.message || "Failed to delete"); }
  };

  if (loading) return <div className="text-gray-500">Loading events...</div>;

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-navy">{editing.id ? "Edit Event" : "New Event"}</h1>
          <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        {errors.length > 0 && (<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">{errors.map((err, i) => (<p key={i} className="text-sm text-red-700 flex items-center gap-2"><AlertCircle size={14} /> {err}</p>))}</div>)}
        <div className="admin-card space-y-5">
          <div><label className="block text-sm font-medium text-navy mb-1">Talk / Presentation Title <span className="text-red-400">*</span></label><input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input-field" /></div>
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-medium text-navy mb-1">Event / Venue Name <span className="text-red-400">*</span></label><input value={editing.event_name ?? ""} onChange={(e) => setEditing({ ...editing, event_name: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Location</label><input value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="input-field" placeholder="City, State" /></div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div><label className="block text-sm font-medium text-navy mb-1">Date</label><input value={editing.date ?? ""} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="input-field" placeholder="2025 or March 2025" /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Type</label>
              <select value={editing.type ?? "speaking"} onChange={(e) => setEditing({ ...editing, type: e.target.value as SpeakingEvent["type"] })} className="input-field">
                <option value="speaking">Speaking</option><option value="panel">Panel</option><option value="lecture">Lecture</option><option value="workshop">Workshop</option><option value="competition">Competition</option>
              </select></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Sort Order</label><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="input-field" /></div>
          </div>
          <div><label className="block text-sm font-medium text-navy mb-1">Description</label><textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input-field" rows={3} /></div>
          <div><label className="block text-sm font-medium text-navy mb-1">URL (optional)</label><input value={editing.url ?? ""} onChange={(e) => setEditing({ ...editing, url: e.target.value })} className="input-field" placeholder="https://..." /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded border-gray-300" /> Published</label>
          <div className="flex gap-3 pt-4 border-t border-gray-100"><Button onClick={handleSave} loading={saving}><Save size={16} /> Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-navy">Speaking & Events</h1><p className="text-sm text-gray-500">{items.length} events</p></div>
        <Button onClick={() => startEdit()}><Plus size={16} /> New Event</Button>
      </div>
      <div className="admin-card">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400"><Mic size={24} className="mx-auto mb-2 opacity-50" /><p className="text-sm">No events yet.</p></div>
        ) : (
          <div className="space-y-3">{items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 border border-gray-100">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium text-navy">{item.title}</p>
                <p className="text-xs text-gray-400">{item.event_name} &middot; {item.date} &middot; <span className="capitalize">{item.type}</span></p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(item.id, item.title)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}</div>
        )}
      </div>
    </div>
  );
}
