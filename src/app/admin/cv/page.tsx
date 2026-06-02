'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Save, X, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { listSubDocs, createSubDoc, updateSubDoc, deleteSubDoc, setDoc, adminApi } from '@/lib/admin-api';

interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  year: string;
  details: string;
  sort_order: number;
}

interface ExperienceItem {
  id?: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  sub_items: { university: string; courses: string }[];
  sort_order: number;
}

export default function AdminCVPage() {
  const toast = useToast();
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [subItemsJson, setSubItemsJson] = useState('[]');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState('');
  const [certifications, setCertifications] = useState('');
  const [awards, setAwards] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [eduData, expData, metaRes] = await Promise.all([
        listSubDocs('cvSections', 'education', 'items', { field: 'sort_order' }),
        listSubDocs('cvSections', 'experience', 'items', { field: 'sort_order' }),
        adminApi({ action: 'get', collection: 'cvSections', id: 'meta' }).catch(() => ({ doc: {} })),
      ]);
      setEducation(eduData as EducationItem[]);
      setExperience(expData as ExperienceItem[]);

      const meta = metaRes.doc || {};
      setSummary(meta.summary ?? '');
      setSkills(Array.isArray(meta.skills) ? meta.skills.join(', ') : '');
      setLanguages(Array.isArray(meta.languages) ? meta.languages.join(', ') : '');
      setCertifications(Array.isArray(meta.certifications) ? meta.certifications.join(', ') : '');
      setAwards(Array.isArray(meta.awards) ? meta.awards.join('\n') : '');
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveMeta = async () => {
    setSaving(true);
    try {
      await setDoc('cvSections', 'meta', {
        summary,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        languages: languages.split(',').map(s => s.trim()).filter(Boolean),
        certifications: certifications.split(',').map(s => s.trim()).filter(Boolean),
        awards: awards.split('\n').map(s => s.trim()).filter(Boolean),
      });
      toast.success('CV meta saved');
    } catch (err: any) { toast.error(err.message || 'Failed to save meta'); }
    setSaving(false);
  };

  const saveEdu = async () => {
    if (!editingEdu?.degree) { toast.error('Degree is required'); return; }
    setSaving(true);
    const payload = { degree: editingEdu.degree, institution: editingEdu.institution, year: editingEdu.year, details: editingEdu.details, sort_order: editingEdu.sort_order };
    try {
      if (editingEdu.id) { await updateSubDoc('cvSections', 'education', 'items', editingEdu.id, payload); }
      else { await createSubDoc('cvSections', 'education', 'items', payload); }
      toast.success('Education entry saved');
      setEditingEdu(null); fetchData();
    } catch (err: any) { toast.error(err.message || 'Failed to save'); }
    setSaving(false);
  };

  const saveExp = async () => {
    if (!editingExp?.title) { toast.error('Title is required'); return; }
    setSaving(true);
    let parsedSub = [];
    try { parsedSub = JSON.parse(subItemsJson); } catch { parsedSub = []; }
    const payload = { title: editingExp.title, organization: editingExp.organization, period: editingExp.period, description: editingExp.description, sub_items: parsedSub, sort_order: editingExp.sort_order };
    try {
      if (editingExp.id) { await updateSubDoc('cvSections', 'experience', 'items', editingExp.id, payload); }
      else { await createSubDoc('cvSections', 'experience', 'items', payload); }
      toast.success('Experience entry saved');
      setEditingExp(null); fetchData();
    } catch (err: any) { toast.error(err.message || 'Failed to save'); }
    setSaving(false);
  };

  const delEdu = async (id: string) => { if (!confirm('Delete this education entry? This cannot be undone.')) return; try { await deleteSubDoc('cvSections', 'education', 'items', id); toast.success('Education entry deleted'); fetchData(); } catch (err: any) { toast.error(err.message || 'Failed to delete'); } };
  const delExp = async (id: string) => { if (!confirm('Delete this experience entry? This cannot be undone.')) return; try { await deleteSubDoc('cvSections', 'experience', 'items', id); toast.success('Experience entry deleted'); fetchData(); } catch (err: any) { toast.error(err.message || 'Failed to delete'); } };

  if (loading) return <div className="text-gray-500">Loading CV data...</div>;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-navy">CV Management</h1>

      {/* Summary & Meta */}
      <div className="admin-card space-y-5">
        <h2 className="font-display text-lg font-semibold text-navy">Summary &amp; Details</h2>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Professional Summary</label>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="input-field" rows={4} />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Skills (comma-separated)</label>
            <textarea value={skills} onChange={(e) => setSkills(e.target.value)} className="input-field" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Languages (comma-separated)</label>
            <input value={languages} onChange={(e) => setLanguages(e.target.value)} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Certifications (comma-separated)</label>
          <input value={certifications} onChange={(e) => setCertifications(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Awards (one per line)</label>
          <textarea value={awards} onChange={(e) => setAwards(e.target.value)} className="input-field" rows={4} />
        </div>
        <Button onClick={saveMeta} loading={saving}><Save size={16} /> Save Meta</Button>
      </div>

      {/* Education */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-navy flex items-center gap-2"><GraduationCap size={20} /> Education</h2>
          <Button size="sm" onClick={() => setEditingEdu({ degree: '', institution: '', year: '', details: '', sort_order: education.length })}><Plus size={14} /> Add</Button>
        </div>
        {editingEdu && (
          <div className="mb-4 p-4 border border-gold-200 rounded-xl bg-gold-50/30 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input value={editingEdu.degree} onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })} className="input-field" placeholder="Degree" />
              <input value={editingEdu.institution} onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })} className="input-field" placeholder="Institution" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <input value={editingEdu.year} onChange={(e) => setEditingEdu({ ...editingEdu, year: e.target.value })} className="input-field" placeholder="Year" />
              <input value={String(editingEdu.sort_order)} onChange={(e) => setEditingEdu({ ...editingEdu, sort_order: parseInt(e.target.value) || 0 })} className="input-field" placeholder="Sort order" />
            </div>
            <input value={editingEdu.details} onChange={(e) => setEditingEdu({ ...editingEdu, details: e.target.value })} className="input-field" placeholder="Details" />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEdu} loading={saving}><Save size={14} /> Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditingEdu(null)}>Cancel</Button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {education.map((edu) => (
            <div key={edu.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-navy">{edu.degree}</p>
                <p className="text-xs text-gray-500">{edu.institution} — {edu.year}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditingEdu(edu)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><Edit2 size={14} /></button>
                <button onClick={() => delEdu(edu.id!)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-navy flex items-center gap-2"><Briefcase size={20} /> Experience</h2>
          <Button size="sm" onClick={() => { setEditingExp({ title: '', organization: '', period: '', description: '', sub_items: [], sort_order: experience.length }); setSubItemsJson('[]'); }}><Plus size={14} /> Add</Button>
        </div>
        {editingExp && (
          <div className="mb-4 p-4 border border-gold-200 rounded-xl bg-gold-50/30 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input value={editingExp.title} onChange={(e) => setEditingExp({ ...editingExp, title: e.target.value })} className="input-field" placeholder="Job Title" />
              <input value={editingExp.organization} onChange={(e) => setEditingExp({ ...editingExp, organization: e.target.value })} className="input-field" placeholder="Organization" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <input value={editingExp.period} onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })} className="input-field" placeholder="Period" />
              <input value={String(editingExp.sort_order)} onChange={(e) => setEditingExp({ ...editingExp, sort_order: parseInt(e.target.value) || 0 })} className="input-field" placeholder="Sort order" />
            </div>
            <textarea value={editingExp.description} onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })} className="input-field" rows={2} placeholder="Description" />
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Sub-items (JSON)</label>
              <textarea value={subItemsJson} onChange={(e) => setSubItemsJson(e.target.value)} className="input-field font-mono text-xs" rows={3} placeholder='[{"university":"...","courses":"..."}]' />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveExp} loading={saving}><Save size={14} /> Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditingExp(null)}>Cancel</Button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {experience.map((exp) => (
            <div key={exp.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-navy">{exp.title}</p>
                <p className="text-xs text-gray-500">{exp.organization} — {exp.period}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditingExp(exp); setSubItemsJson(JSON.stringify(exp.sub_items ?? [], null, 2)); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><Edit2 size={14} /></button>
                <button onClick={() => delExp(exp.id!)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
