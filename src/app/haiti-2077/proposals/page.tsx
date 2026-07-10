import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { getApprovedProposals, getFeaturedProposals } from '@/lib/data';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Citizen Proposals | Haiti 2077',
  description: 'Approved citizen proposals for Haiti long-term transformation, organized by policy pillar and department.',
};

export default async function ProposalsPage() {
  const [proposals, featured] = await Promise.all([getApprovedProposals(), getFeaturedProposals()]);

  return (
    <div>
      <section className="page-header">
        <div className="section-container">
          <Link href="/haiti-2077" className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-6 hover:text-gold-300 transition-colors"><ArrowLeft size={16} /> Haiti 2077</Link>
          <h1 className="page-header-title">Citizen Proposals</h1>
          <p className="page-header-subtitle">Approved contributions from citizens, professionals, and organizations committed to Haiti&apos;s long-term transformation.</p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-12 bg-navy">
          <div className="section-container">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-6">Featured Proposals</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((p: any) => (
                <Link key={p.id} href={'/haiti-2077/proposals/' + p.id} className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all">
                  <Star size={14} className="text-gold mb-2" />
                  <h3 className="text-sm font-semibold text-white group-hover:text-gold transition-colors mb-2">{p.proposalTitle}</h3>
                  <p className="text-[11px] text-white/40 line-clamp-2 mb-3">{p.problemAddressed}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-gold/10 text-gold/70 px-2 py-0.5 rounded">{p.policyPillar?.split(' ').slice(0, 3).join(' ')}</span>
                    <span className="text-[10px] text-white/30">{p.timeHorizon}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-section bg-white">
        <div className="section-container">
          {proposals.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 mb-4">No approved proposals yet. Be the first to contribute!</p>
              <Link href="/haiti-2077/contribute" className="bg-gold hover:bg-gold-300 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2">Submit a Proposal <ArrowRight size={14} /></Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {proposals.map((p: any) => (
                <Link key={p.id} href={'/haiti-2077/proposals/' + p.id} className="group p-6 rounded-2xl border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all">
                  <h3 className="font-display text-sm font-semibold text-navy group-hover:text-gold transition-colors mb-2">{p.proposalTitle}</h3>
                  <p className="text-[12px] text-gray-400 line-clamp-3 mb-4">{p.problemAddressed}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[10px] bg-navy/5 text-navy/60 px-2 py-0.5 rounded">{p.policyPillar?.split(' ').slice(0, 3).join(' ')}</span>
                    {p.departmentConcerned && <span className="text-[10px] bg-gold/5 text-gold/70 px-2 py-0.5 rounded flex items-center gap-0.5"><MapPin size={8} /> {p.departmentConcerned}</span>}
                    <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded flex items-center gap-0.5"><Clock size={8} /> {p.timeHorizon}</span>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    {p.permissionToPublishName ? p.fullName + (p.profession ? ', ' + p.profession : '') : 'Submitted by a contributor'}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/haiti-2077/contribute" className="bg-gold hover:bg-gold-300 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2">Submit Your Idea <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
