import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { getDepartments, getApprovedProposals } from '@/lib/data';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  return getDepartments().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const dept = getDepartments().find(d => d.slug === params.slug);
  if (!dept) return { title: 'Department Not Found' };
  return {
    title: dept.name + ' | Haiti 2077',
    description: dept.description,
    openGraph: { title: dept.name + ' | Haiti 2077', description: dept.description, images: [{ url: '/images/Dieulin-website.jpg' }] },
  };
}

export default async function DepartmentDetailPage({ params }: { params: { slug: string } }) {
  const departments = getDepartments();
  const dept = departments.find(d => d.slug === params.slug);
  if (!dept) notFound();

  const proposals = await getApprovedProposals();
  const deptProposals = proposals.filter((p: any) => p.departmentConcerned === dept.name || p.departmentInterest === dept.name);

  return (
    <div>
      <section className="bg-navy pt-32 pb-16">
        <div className="section-container max-w-3xl">
          <Link href="/haiti-2077" className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-8 hover:text-gold-300 transition-colors">
            <ArrowLeft size={16} /> Haiti 2077
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
              <MapPin size={24} className="text-gold" />
            </div>
          </div>
          <h1 className="font-display text-[clamp(28px,4vw,40px)] font-bold text-white mb-4">{dept.name}</h1>
          <p className="text-white/50 text-lg leading-relaxed">{dept.description}</p>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-3xl">
          <h2 className="font-display text-xl font-bold text-navy mb-6">Priority Sectors</h2>
          <div className="flex flex-wrap gap-3">
            {dept.prioritySectors.map((s, i) => (
              <span key={i} className="text-sm bg-gold/10 text-gold px-4 py-2 rounded-xl font-medium">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {deptProposals.length > 0 && (
        <section className="py-section bg-gray-50/50">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-xl font-bold text-navy mb-6">Proposals for {dept.name}</h2>
            <div className="space-y-4">
              {deptProposals.map((p: any) => (
                <Link key={p.id} href={'/haiti-2077/proposals/' + p.id} className="block p-5 rounded-xl border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all bg-white">
                  <h3 className="text-sm font-semibold text-navy mb-1">{p.proposalTitle}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">{p.problemAddressed}</p>
                  <span className="text-[10px] bg-navy/5 text-navy/60 px-2 py-0.5 rounded">{p.policyPillar?.split(' ').slice(0, 3).join(' ')}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-navy">
        <div className="section-container max-w-3xl text-center">
          <h3 className="font-display text-xl font-semibold text-white mb-3">Contribute Ideas for {dept.name}</h3>
          <p className="text-white/40 text-sm mb-6">Share your vision for the development of {dept.name} department.</p>
          <Link href="/haiti-2077/contribute" className="bg-gold hover:bg-gold-300 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2">Submit a Proposal <ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* Navigation to other departments */}
      <section className="py-8 bg-white border-t border-gray-100">
        <div className="section-container max-w-3xl">
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 mb-4">Other Departments</p>
          <div className="flex flex-wrap gap-2">
            {departments.filter(d => d.slug !== dept.slug).map(d => (
              <Link key={d.slug} href={'/haiti-2077/departments/' + d.slug} className="text-xs bg-gray-50 hover:bg-gold/10 text-gray-500 hover:text-gold px-3 py-1.5 rounded-lg transition-colors">{d.name}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
