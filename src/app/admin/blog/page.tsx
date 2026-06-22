'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Save, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { listDocs, createDoc, updateDoc, deleteDoc } from '@/lib/admin-api';
import { slugify } from '@/lib/utils';
import type { BlogPost, ContentBlock } from '@/types';

const CATEGORIES = ['Finance', 'Entrepreneurship', 'Project Management', 'Sustainability and Impact', 'Haiti and Development', 'Leadership and Ethics'];

const EMPTY_POST: Partial<BlogPost> = {
  title: '', slug: '', category: 'Finance', excerpt: '', content: [],
  tags: [], published: false, featured: false, read_time: '5 min', original_lang: '',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [contentJson, setContentJson] = useState('');
  const [contentError, setContentError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const toast = useToast();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPosts = useCallback(async () => {
    try {
      const data = await listDocs<BlogPost>('blogPosts', { field: 'created_at', direction: 'desc' });
      setPosts(data);
    } catch (err: any) {
      toast.error('Failed to load blog posts');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const startEdit = (post?: BlogPost) => {
    const p = post ?? { ...EMPTY_POST };
    setEditing(p);
    setTagsInput((p.tags ?? []).join(', '));
    setContentJson(JSON.stringify(p.content ?? [], null, 2));
    setContentError('');
    setValidationErrors([]);
  };

  const validateContentJson = (json: string): ContentBlock[] | null => {
    if (!json.trim() || json.trim() === '[]') return [];
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) { setContentError('Content must be a JSON array'); return null; }
      for (let i = 0; i < parsed.length; i++) {
        if (!parsed[i].type || (!parsed[i].text && !['table', 'image', 'link'].includes(parsed[i].type))) {
          setContentError(`Block ${i + 1}: requires "type" and "text" fields`);
          return null;
        }
        if (!['p', 'h', 'h3', 'note', 'quote', 'list', 'table', 'image', 'link', 'callout'].includes(parsed[i].type)) {
          setContentError(`Block ${i + 1}: invalid type "${parsed[i].type}". Use: p, h, h3, note, quote, list, table, image, link, callout`);
          return null;
        }
      }
      setContentError('');
      return parsed;
    } catch (e: any) {
      setContentError(`Invalid JSON: ${e.message}`);
      return null;
    }
  };

  const validate = (): boolean => {
    const errors: string[] = [];
    if (!editing?.title?.trim()) errors.push('Title is required');
    if (!editing?.category) errors.push('Category is required');
    if (!editing?.excerpt?.trim()) errors.push('Excerpt is required');
    if (contentJson.trim() && validateContentJson(contentJson) === null) errors.push('Content JSON is invalid');
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    const slug = editing!.slug?.trim() || slugify(editing!.title!);
    const parsedContent = validateContentJson(contentJson) ?? [];

    const payload = {
      title: editing!.title!.trim(),
      slug,
      category: editing!.category ?? 'Finance',
      excerpt: editing!.excerpt?.trim() ?? '',
      content: parsedContent,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      published: editing!.published ?? false,
      featured: editing!.featured ?? false,
      read_time: editing!.read_time ?? '5 min',
      original_lang: editing!.original_lang ?? '',
    };

    try {
      if (editing!.id) {
        await updateDoc('blogPosts', editing!.id, payload);
        toast.success('Post updated');
      } else {
        await createDoc('blogPosts', payload);
        toast.success('Post created');
      }
      setEditing(null);
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save post');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteDoc('blogPosts', id);
      toast.success('Post deleted');
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete post');
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      await updateDoc('blogPosts', post.id, { published: !post.published });
      toast.success(post.published ? 'Post unpublished' : 'Post published');
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update post');
    }
  };

  if (loading) return <div className="text-gray-500">Loading posts...</div>;

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-navy">
            {editing.id ? 'Edit Post' : 'New Post'}
          </h1>
          <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>

        {validationErrors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            {validationErrors.map((err, i) => (
              <p key={i} className="text-sm text-red-700 flex items-center gap-2"><AlertCircle size={14} /> {err}</p>
            ))}
          </div>
        )}

        <div className="admin-card space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Title <span className="text-red-400">*</span></label>
              <input value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="input-field" placeholder="Post title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Slug</label>
              <input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="input-field" placeholder="auto-generated-from-title" />
              <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate from title</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Category <span className="text-red-400">*</span></label>
              <select value={editing.category ?? ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input-field">
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Read Time</label>
              <input value={editing.read_time ?? ''} onChange={(e) => setEditing({ ...editing, read_time: e.target.value })} className="input-field" placeholder="5 min" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Original Language</label>
              <select value={editing.original_lang ?? ''} onChange={(e) => setEditing({ ...editing, original_lang: e.target.value })} className="input-field">
                <option value="">None</option>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="ht">Haitian Creole</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Excerpt <span className="text-red-400">*</span></label>
            <textarea value={editing.excerpt ?? ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              className="input-field" rows={3} placeholder="Brief description shown in cards and SEO" />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Tags (comma-separated)</label>
            <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
              className="input-field" placeholder="finance, investing, strategy" />
            {tagsInput && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tagsInput.split(',').map((t) => t.trim()).filter(Boolean).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-navy/5 text-navy text-xs rounded-md">{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-navy">Content Blocks (JSON)</label>
              <button
                type="button"
                onClick={() => {
                  const current = contentJson.trim() ? JSON.parse(contentJson) : [];
                  current.push({ type: 'p', text: '' });
                  setContentJson(JSON.stringify(current, null, 2));
                }}
                className="text-xs text-gold hover:text-navy font-medium"
              >
                + Add paragraph block
              </button>
            </div>
            <textarea value={contentJson} onChange={(e) => { setContentJson(e.target.value); setContentError(''); }}
              className={`input-field font-mono text-xs ${contentError ? 'border-red-300 focus:ring-red-300' : ''}`}
              rows={14}
              placeholder='[&#10;  { "type": "p", "text": "Paragraph..." },&#10;  { "type": "h", "text": "Section Heading" },&#10;  { "type": "note", "text": "A callout note" }&#10;]' />
            {contentError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {contentError}</p>}
            <p className="text-xs text-gray-400 mt-1">
              Types: <code className="bg-gray-100 px-1 rounded">p</code> paragraph · <code className="bg-gray-100 px-1 rounded">h</code> heading · <code className="bg-gray-100 px-1 rounded">h3</code> subheading · <code className="bg-gray-100 px-1 rounded">note</code> callout · <code className="bg-gray-100 px-1 rounded">quote</code> · <code className="bg-gray-100 px-1 rounded">list</code> (add items array) · <code className="bg-gray-100 px-1 rounded">table</code> (add headers + rows arrays) · <code className="bg-gray-100 px-1 rounded">image</code> (add src) · <code className="bg-gray-100 px-1 rounded">link</code> (add url + label) · <code className="bg-gray-100 px-1 rounded">callout</code> highlight
            </p>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published ?? false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded border-gray-300" /> Published</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="rounded border-gray-300" /> Featured</label>
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
          <h1 className="font-display text-2xl font-bold text-navy">Blog Posts</h1>
          <p className="text-sm text-gray-500">{posts.length} posts · {posts.filter(p => p.published).length} published</p>
        </div>
        <Button onClick={() => startEdit()}><Plus size={16} /> New Post</Button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div><p className="font-medium text-navy text-sm">{post.title}</p><p className="text-xs text-gray-400">/{post.slug}</p></div>
                </td>
                <td><span className="category-badge">{post.category}</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    {post.published
                      ? <span className="text-xs font-medium text-emerald bg-emerald/10 px-2 py-0.5 rounded">Published</span>
                      : <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Draft</span>}
                    {post.featured && <Star size={14} className="text-gold fill-gold" />}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => togglePublished(post)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy" title={post.published ? 'Unpublish' : 'Publish'}>
                      {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => startEdit(post)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy" title="Edit"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(post.id, post.title)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No blog posts yet. Create your first one!</p>}
      </div>
    </div>
  );
}
