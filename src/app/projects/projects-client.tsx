'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

const CATEGORIES = ['All', 'Startups', 'Finance & Investment', 'Civic Innovation', 'Haiti-focused Ventures', 'Sustainability / ESG'];

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section className="py-section-sm bg-white">
      <div className="section-container">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
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

        {/* Projects */}
        <div className="space-y-4">
          {filtered.map((project) => {
            const isOpen = expandedId === project.id;
            return (
              <div key={project.id} className="card">
                <div className="card-gold-bar" />
                <div className="p-7">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="category-badge">{project.category}</span>
                        <span className="text-xs font-medium text-emerald bg-emerald/10 px-2 py-0.5 rounded">
                          {project.status}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-semibold text-navy mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
                    </div>
                    <button
                      onClick={() => setExpandedId(isOpen ? null : project.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                      aria-label={isOpen ? 'Collapse' : 'Expand'}
                    >
                      <ChevronDown size={20} className={cn('text-gray-400 transition-transform', isOpen && 'rotate-180')} />
                    </button>
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.tech.map((t) => (
                      <span key={t} className="tag">#{t}</span>
                    ))}
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="mt-6 pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-6 animate-fade-in">
                      <DetailField label="Problem" value={project.problem} />
                      <DetailField label="Solution" value={project.solution} />
                      <DetailField label="Role" value={project.role} />
                      <DetailField label="Impact" value={project.impact} />
                      <Link href={'/projects/' + project.slug} className="inline-flex items-center gap-1 text-gold text-sm font-semibold hover:text-navy transition-colors">
                  View Details <span className="text-xs">→</span>
                </Link>
                {project.url && (
                        <div className="md:col-span-2">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-gold text-sm font-semibold hover:underline"
                          >
                            Visit Project <ExternalLink size={14} />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No projects in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
      <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
    </div>
  );
}
