"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X, Star, Trash2, Eye, FileText, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { listDocs, updateDoc, deleteDoc } from "@/lib/admin-api";

const STATUSES = ['all', 'pending', 'approved', 'rejected'];
const STATUS_COLORS: Record<string, string> = { pending: 'bg-amber-50 text-amber-600', approved: 'bg-emerald-50 text-emerald-600', rejected: 'bg-red-50 text-red-500' };

export default function AdminHaiti2077Page() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetch = useCallback(async () => {
    try {
      const data = await listDocs('haiti2077Proposals', { field: 'created_at', direction: 'desc' });
      setProposals(data);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc('haiti2077Proposals', id, { status, updated_at: new Date().toISOString() });
      toast.success('Status updated to ' + status);
      fetch();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch { toast.error('Failed to update'); }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await updateDoc('haiti2077Proposals', id, { featured: !current });
      toast.success(current ? 'Unfeatured' : 'Featured');
      fetch();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this proposal permanently?')) return;
    try {
      await deleteDoc('haiti2077Proposals', id);
      toast.success('Deleted');
      setSelected(null);
      fetch();
    } catch { toast.error('Failed to delete'); }
  };

  const saveNotes = async (id: string, notes: string) => {
    try {
      await updateDoc('haiti2077Proposals', id, { adminNotes: notes });
      toast.success('Notes saved');
    } catch { toast.error('Failed to save notes'); }
  };

  const filtered = filter === 'all' ? proposals : proposals.filter(p => p.status === filter);

  if (loading) return <div className="text-gray-500">Loading proposals...</div>;

  if (selected) return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-navy">Review Proposal</h1>
        <button onClick={() => setSelected(null)} className="text-sm text-gray-400 hover:text-navy">&times; Back to list</button>
      </div>
      <div className="admin-card space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <span className={"text-xs px-3 py-1 rounded-full font-medium " + (STATUS_COLORS[selected.status] || 'bg-gray-100 text-gray-500')}>{selected.status}</span>
          {selected.featured && <Star size={14} className="text-gold fill-gold" />}
          <span className="text-xs text-gray-400 ml-auto">{selected.created_at ? new Date(selected.created_at).toLocaleDateString() : ''}</span>
        </div>
        <h2 className="font-display text-xl font-bold text-navy">{selected.proposalTitle}</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <p><span className="font-medium text-navy">Name:</span> {selected.fullName}</p>
          <p><span className="font-medium text-navy">Email:</span> {selected.email}</p>
          <p><span className="font-medium text-navy">Profession:</span> {selected.profession}</p>
          <p><span className="font-medium text-navy">Education:</span> {selected.educationLevel}</p>
          <p><span className="font-medium text-navy">Organization:</span> {selected.organization || '—'}</p>
          <p><span className="font-medium text-navy">Location:</span> {selected.countryCity || '—'}</p>
          <p><span className="font-medium text-navy">Pillar:</span> {selected.policyPillar}</p>
          <p><span className="font-medium text-navy">Department:</span> {selected.departmentConcerned || 'National'}</p>
          <p><span className="font-medium text-navy">Time Horizon:</span> {selected.timeHorizon}</p>
          <p><span className="font-medium text-navy">Publish Name:</span> {selected.permissionToPublishName ? 'Yes' : 'No'}</p>
        </div>
        <div><h3 className="text-sm font-semibold text-navy mb-1">Problem Addressed</h3><p className="text-sm text-gray-600 leading-relaxed">{selected.problemAddressed}</p></div>
        <div><h3 className="text-sm font-semibold text-navy mb-1">Proposed Solution</h3><p className="text-sm text-gray-600 leading-relaxed">{selected.proposedSolution}</p></div>
        <div><h3 className="text-sm font-semibold text-navy mb-1">Expected Impact</h3><p className="text-sm text-gray-600 leading-relaxed">{selected.expectedImpact}</p></div>
        {selected.implementationActors?.length > 0 && <div><h3 className="text-sm font-semibold text-navy mb-1">Actors</h3><p className="text-sm text-gray-500">{selected.implementationActors.join(', ')}</p></div>}
        {selected.sources && <div><h3 className="text-sm font-semibold text-navy mb-1">Sources</h3><p className="text-sm text-gray-500">{selected.sources}</p></div>}
        <div>
          <h3 className="text-sm font-semibold text-navy mb-1">Admin Notes</h3>
          <textarea defaultValue={selected.adminNotes || ''} onBlur={(e) => saveNotes(selected.id, e.target.value)} className="input-field text-sm" rows={3} placeholder="Internal notes..." />
        </div>
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          <Button onClick={() => updateStatus(selected.id, 'approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white"><Check size={14} /> Approve</Button>
          <Button onClick={() => updateStatus(selected.id, 'rejected')} className="bg-red-500 hover:bg-red-600 text-white"><X size={14} /> Reject</Button>
          <Button onClick={async () => { try { await updateDoc('haiti2077Proposals', selected.id, { incorporatedIntoPlan: !selected.incorporatedIntoPlan, updated_at: new Date().toISOString() }); toast.success(selected.incorporatedIntoPlan ? 'Removed from plan' : 'Incorporated into plan'); fetch(); setSelected({ ...selected, incorporatedIntoPlan: !selected.incorporatedIntoPlan }); } catch { toast.error('Failed'); } }} className="bg-blue-500 hover:bg-blue-600 text-white"><FileText size={14} /> {selected.incorporatedIntoPlan ? 'Remove from Plan' : 'Incorporate'}</Button>
          <Button onClick={() => toggleFeatured(selected.id, selected.featured)} variant="outline"><Star size={14} /> {selected.featured ? 'Unfeature' : 'Feature'}</Button>
          <Button onClick={() => handleDelete(selected.id)} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50"><Trash2 size={14} /> Delete</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Haiti 2077 Proposals</h1>
          <p className="text-sm text-gray-500">{proposals.length} total, {proposals.filter(p => p.status === 'pending').length} pending</p>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={"text-xs px-3 py-1.5 rounded-lg border transition-colors capitalize " + (filter === s ? "bg-navy text-white border-navy" : "bg-white text-gray-500 border-gray-200 hover:border-navy/20")}>{s} {s !== 'all' ? '(' + proposals.filter(p => p.status === s).length + ')' : ''}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((p: any) => (
          <button key={p.id} onClick={() => setSelected(p)} className="admin-card w-full text-left flex items-start gap-4 hover:shadow-sm transition-shadow">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={"text-[10px] px-2 py-0.5 rounded-full font-medium " + (STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-500')}>{p.status}</span>
                {p.featured && <Star size={10} className="text-gold fill-gold" />}{p.incorporatedIntoPlan && <FileText size={10} className="text-blue-500" />}
              </div>
              <p className="text-sm font-medium text-navy truncate">{p.proposalTitle}</p>
              <p className="text-[11px] text-gray-400 truncate">{p.policyPillar} &middot; {p.fullName} &middot; {p.timeHorizon}</p>
            </div>
            <span className="text-[10px] text-gray-300 shrink-0">{p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}</span>
          </button>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-400 py-8 text-center">No {filter === 'all' ? '' : filter} proposals.</p>}
      </div>
    </div>
  );
}
