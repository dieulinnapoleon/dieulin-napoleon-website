import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProjects, getProject } from '@/lib/data';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title + ' | Dieulin Napoleon',
      description: project.description,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <>
      {/* Header */}
      <section className="bg-navy pt-32 pb-16">
        <div className="section-container">
          <Link href="/projects" className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-6 hover:text-gold-300 transition-colors">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="category-badge bg-gold/15 text-gold border-gold/30">{project.category}</span>
            <span className="text-xs text-white/40">{project.status}</span>
          </div>
          <h1 className="font-display text-[clamp(32px,5vw,52px)] font-bold text-white mb-4">{project.title}</h1>
          <p className="text-lg text-white/50 max-w-2xl leading-relaxed">{project.description}</p>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-gold hover:text-gold-300 text-sm font-semibold transition-colors">
              <Globe size={16} /> Visit Project <ExternalLink size={14} />
            </a>
          )}
        </div>
      </section>

      {/* Details */}
      <section className="py-16">
        <div className="section-container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {project.problem && (
              <div className="p-8 rounded-2xl bg-red-50/50 border border-red-100">
                <h2 className="font-display text-lg font-semibold text-navy mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500 text-sm">!</span>
                  Problem
                </h2>
                <p className="text-gray-600 leading-relaxed">{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div className="p-8 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <h2 className="font-display text-lg font-semibold text-navy mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-500 text-sm">&#10003;</span>
                  Solution
                </h2>
                <p className="text-gray-600 leading-relaxed">{project.solution}</p>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-6 rounded-xl border border-gray-100">
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-gold mb-2">My Role</p>
              <p className="text-sm text-navy font-medium">{project.role}</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-100">
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-gold mb-2">Status</p>
              <p className="text-sm text-navy font-medium">{project.status}</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-100">
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-gold mb-2">Technologies</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {project.tech.map((t) => (
                  <span key={t} className="text-xs bg-navy/5 text-navy px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-xl border border-gray-100">
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-gold mb-2">Impact</p>
              <p className="text-sm text-navy font-medium">{project.impact}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-12 rounded-2xl bg-navy">
            <h3 className="font-display text-2xl font-semibold text-white mb-4">Interested in this project?</h3>
            <p className="text-white/50 mb-6">I am always open to conversations about partnerships, investment, and collaboration.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/contact">
                <Button className="bg-gold hover:bg-gold-300 text-white">Get in Touch <ArrowRight size={16} /></Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-navy">View All Projects</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
