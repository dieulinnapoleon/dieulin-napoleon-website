'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, Clock } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

const CATEGORIES = [
  'All',
  'Finance',
  'Entrepreneurship',
  'Project Management',
  'Sustainability and Impact',
  'Haiti and Development',
  'Leadership and Ethics',
];

interface Props {
  posts: BlogPost[];
}

export function InsightsClient({ posts }: Props) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  let filtered = posts;
  if (filter !== 'All') {
    filtered = filtered.filter((p) => p.category === filter);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return (
    <section className="py-section-sm bg-white">
      <div className="section-container">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                  filter === cat
                    ? 'border-gold bg-gold-muted text-navy'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="input-field pl-10 w-full md:w-60"
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <Link key={post.id} href={`/insights/${post.slug}`} className="card group">
              <div className="card-gold-bar" />
              <div className="p-7">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="category-badge">{post.category}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(post.created_at)}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {post.read_time}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-navy mb-3 leading-tight group-hover:text-gold transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((t) => (
                    <span key={t} className="tag">#{t}</span>
                  ))}
                </div>
                <span className="text-gold text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Article
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No articles found.</p>
            <p className="text-sm mt-2">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
