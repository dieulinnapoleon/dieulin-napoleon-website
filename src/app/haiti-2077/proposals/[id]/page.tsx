import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, MapPin, Users, Target, Briefcase, GraduationCap } from 'lucide-react';
import { getProposalById, getPillars, getDepartments } from '@/lib/data';
import { ShareButtons } from '@/components/ui/share-buttons';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await getProposalById(params.id);
  if (!p) return { title: 'Proposal Not Found' };
  const title = p.proposalTitle + ' | Haiti 2077 Citizen Proposal';
  const desc = p.problemAddressed?.substring(0, 160);
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'article', url: 'https://dieulinnapoleon.com/haiti-2077/proposals/' + params.id, images: [{ url: '/images/Dieulin-website.jpg', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: ['/images/Dieulin-website.jpg'] },
  };
}

export default async function ProposalDetailPage({ params }: { params: { id: string } }) {
  const p = await getProposalById(params.id);
  if (!p) notFound();

  const pillars = getPillars();
  const departments = getDepartments();
  const relatedPillar = pillars.find(pl => pl.title === p.policyPillar);
  const relatedDept = departments.find(d => d.name === p.departmentConcerned);

  return (
    <div>
      <section className="bg-navy pt-32 pb-16">
        <div className="section-container max-w-3xl">
          <Link href="/haiti-2077/proposals" className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-8 hover:text-gold-300 transition-colors"><ArrowLeft size={16} /> All Proposals</Link>
          <h1 className="font-display text-[clamp(24px,4vw,36px)] font-bold text-white mb-4">{p.proposalTitle}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {relatedPillar ? (
              <Link href={'/haiti-2077/pillars/' + relatedPillar.slug} className="text-[11px] bg-gold/10 text-gold px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gold/20 transition-colors"><Target size={10} /> {p.policyPillar}</Link>
            ) : (
              <span className="text-[11px] bg-gold/10 text-gold px-3 py-1 rounded-full flex items-center gap-1"><Target size={10} /> {p.policyPillar}</span>
            )}
            {p.departmentConcerned && (
              relatedDept ? (
                <Link href={'/haiti-2077/departments/' + relatedDept.slug} className="text-[11px] bg-white/10 text-white/50 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-white/20 transition-colors"><MapPin size={10} /> {p.departmentConcerned}</Link>
              ) : (
                <span className="text-[11px] bg-white/10 text-white/50 px-3 py-1 rounded-full flex items-center gap-1"><MapPin size={10} /> {p.departmentConcerned}</span>
              )
            )}
            <span className="text-[11px] bg-white/10 text-white/50 px-3 py-1 rounded-full flex items-center gap-1"><Clock size={10} /> {p.timeHorizon}</span>
          </div>

          {/* Contributor info - respecting permission */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            {p.permissionToPublishName ? (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <Users size={16} className="text-gold" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{p.fullName}</p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {p.profession && <span className="text-[11px] text-white/40 flex items-center gap-1"><Briefcase size={10} /> {p.profession}</span>}
                    {p.educationLevel && <span className="text-[11px] text-white/40 flex items-center gap-1"><GraduationCap size={10} /> {p.educationLevel}</span>}
                    {p.countryCity && <span className="text-[11px] text-white/40 flex items-center gap-1"><MapPin size={10} /> {p.countryCity}</span>}
                    {p.organization && <span className="text-[11px] text-white/40">{p.organization}</span>}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/40 italic">Submitted by a contributor (name withheld by request)</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-3xl">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-lg font-semibold text-navy mb-3 flex items-center gap-2"><span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 text-xs font-bold">1</span> Problem Addressed</h2>
              <p className="text-gray-600 leading-relaxed">{p.problemAddressed}</p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-navy mb-3 flex items-center gap-2"><span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 text-xs font-bold">2</span> Proposed Solution</h2>
              <p className="text-gray-600 leading-relaxed">{p.proposedSolution}</p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-navy mb-3 flex items-center gap-2"><span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-xs font-bold">3</span> Expected Impact</h2>
              <p className="text-gray-600 leading-relaxed">{p.expectedImpact}</p>
            </div>
            {p.implementationActors?.length > 0 && (
              <div>
                <h2 className="font-display text-lg font-semibold text-navy mb-3 flex items-center gap-2"><span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 text-xs font-bold">4</span> Implementation Actors</h2>
                <div className="flex flex-wrap gap-2">
                  {p.implementationActors.map((a: string) => (
                    <span key={a} className="text-sm bg-navy/5 text-navy/60 px-4 py-2 rounded-xl flex items-center gap-1.5"><Users size={14} /> {a}</span>
                  ))}
                </div>
              </div>
            )}
            {p.sources && (
              <div>
                <h2 className="font-display text-lg font-semibold text-navy mb-3 flex items-center gap-2"><span className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 text-xs font-bold">5</span> Sources &amp; References</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{p.sources}</p>
              </div>
            )}
          </div>

          {/* Share buttons */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="notranslate" translate="no">
              <ShareButtons slug={params.id} title={p.proposalTitle} />
            </div>
          </div>

          {/* Related links */}
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {relatedPillar && (
              <Link href={'/haiti-2077/pillars/' + relatedPillar.slug} className="p-5 rounded-xl border border-gray-100 hover:border-gold/30 transition-all">
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold mb-1">Related Pillar</p>
                <p className="text-sm font-semibold text-navy">{relatedPillar.title}</p>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{relatedPillar.description}</p>
              </Link>
            )}
            {relatedDept && (
              <Link href={'/haiti-2077/departments/' + relatedDept.slug} className="p-5 rounded-xl border border-gray-100 hover:border-gold/30 transition-all">
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold mb-1">Related Department</p>
                <p className="text-sm font-semibold text-navy">{relatedDept.name}</p>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{relatedDept.description}</p>
              </Link>
            )}
          </div>

          <div className="mt-12 text-center p-10 rounded-2xl bg-navy">
            <h3 className="font-display text-xl font-semibold text-white mb-3">Share Your Ideas Too</h3>
            <p className="text-white/40 text-sm mb-6">Haiti 2077 welcomes constructive proposals from all citizens.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/haiti-2077/contribute" className="bg-gold hover:bg-gold-300 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">Submit a Proposal <ArrowRight size={14} /></Link>
              <Link href="/haiti-2077/proposals" className="border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">All Proposals</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
