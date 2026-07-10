import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, MapPin, Users, Target } from 'lucide-react';
import { getProposalById } from '@/lib/data';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await getProposalById(params.id);
  if (!p) return { title: 'Proposal Not Found' };
  return {
    title: p.proposalTitle + ' | Haiti 2075',
    description: p.problemAddressed?.substring(0, 160),
    openGraph: { title: p.proposalTitle + ' | Haiti 2075', description: p.problemAddressed?.substring(0, 160), images: [{ url: '/images/Dieulin-website.jpg' }] },
  };
}

export default async function ProposalDetailPage({ params }: { params: { id: string } }) {
  const p = await getProposalById(params.id);
  if (!p) notFound();

  return (
    <div>
      <section className="bg-navy pt-32 pb-16">
        <div className="section-container max-w-3xl">
          <Link href="/haiti-2075/proposals" className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-8 hover:text-gold-300 transition-colors"><ArrowLeft size={16} /> All Proposals</Link>
          <h1 className="font-display text-[clamp(24px,4vw,36px)] font-bold text-white mb-4">{p.proposalTitle}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[11px] bg-gold/10 text-gold px-3 py-1 rounded-full flex items-center gap-1"><Target size={10} /> {p.policyPillar}</span>
            {p.departmentConcerned && <span className="text-[11px] bg-white/10 text-white/50 px-3 py-1 rounded-full flex items-center gap-1"><MapPin size={10} /> {p.departmentConcerned}</span>}
            <span className="text-[11px] bg-white/10 text-white/50 px-3 py-1 rounded-full flex items-center gap-1"><Clock size={10} /> {p.timeHorizon}</span>
          </div>
          <p className="text-white/40 text-sm">
            {p.permissionToPublishName ? 'Submitted by ' + p.fullName + (p.profession ? ', ' + p.profession : '') + (p.countryCity ? ' — ' + p.countryCity : '') : 'Submitted by a contributor'}
          </p>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-3xl">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-lg font-semibold text-navy mb-3">Problem Addressed</h2>
              <p className="text-gray-600 leading-relaxed">{p.problemAddressed}</p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-navy mb-3">Proposed Solution</h2>
              <p className="text-gray-600 leading-relaxed">{p.proposedSolution}</p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-navy mb-3">Expected Impact</h2>
              <p className="text-gray-600 leading-relaxed">{p.expectedImpact}</p>
            </div>
            {p.implementationActors?.length > 0 && (
              <div>
                <h2 className="font-display text-lg font-semibold text-navy mb-3">Implementation Actors</h2>
                <div className="flex flex-wrap gap-2">
                  {p.implementationActors.map((a: string) => (
                    <span key={a} className="text-xs bg-navy/5 text-navy/60 px-3 py-1.5 rounded-lg flex items-center gap-1"><Users size={12} /> {a}</span>
                  ))}
                </div>
              </div>
            )}
            {p.sources && (
              <div>
                <h2 className="font-display text-lg font-semibold text-navy mb-3">Sources &amp; References</h2>
                <p className="text-gray-500 text-sm">{p.sources}</p>
              </div>
            )}
          </div>

          <div className="mt-16 text-center p-10 rounded-2xl bg-navy">
            <h3 className="font-display text-xl font-semibold text-white mb-3">Share Your Ideas Too</h3>
            <p className="text-white/40 text-sm mb-6">Haiti 2075 welcomes constructive proposals from all citizens.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/haiti-2075/contribute" className="bg-gold hover:bg-gold-300 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">Submit a Proposal <ArrowRight size={14} /></Link>
              <Link href="/haiti-2075/proposals" className="border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">All Proposals</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
