import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Target, Shield, GraduationCap, Heart, Lightbulb, Truck, Building2, Zap, Droplets, Cpu, TreePine, Globe, Factory, Banknote, Users, CloudRain, MapPin, Flag } from 'lucide-react';
import { getPillars, getApprovedProposals } from '@/lib/data';
import type { Metadata } from 'next';

export const revalidate = 60;

const ICONS: Record<string, any> = { Landmark: Target, Shield, GraduationCap, Heart, Wheat: Lightbulb, Truck, Building2, Zap, Droplets, Cpu, TreePine, Palmtree: Globe, Factory, Banknote, Globe, ArrowLeftRight: ArrowRight, Users, CloudRain, MapPin, Flag };

export async function generateStaticParams() {
  return getPillars().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const pillar = getPillars().find(p => p.slug === params.slug);
  if (!pillar) return { title: 'Pillar Not Found' };
  return {
    title: pillar.title + ' | Haiti 2077',
    description: pillar.description,
    openGraph: { title: pillar.title + ' | Haiti 2077', description: pillar.description, images: [{ url: '/images/Dieulin-website.jpg' }] },
  };
}

export default async function PillarDetailPage({ params }: { params: { slug: string } }) {
  const pillars = getPillars();
  const pillar = pillars.find(p => p.slug === params.slug);
  if (!pillar) notFound();

  const Icon = ICONS[pillar.icon] || Target;
  const proposals = await getApprovedProposals();
  const pillarProposals = proposals.filter((p: any) => p.policyPillar === pillar.title);

  const currentIndex = pillars.findIndex(p => p.slug === params.slug);
  const prev = currentIndex > 0 ? pillars[currentIndex - 1] : null;
  const next = currentIndex < pillars.length - 1 ? pillars[currentIndex + 1] : null;

  return (
    <div>
      <section className="bg-navy pt-32 pb-16">
        <div className="section-container max-w-3xl">
          <Link href="/haiti-2077#pillars" className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-8 hover:text-gold-300 transition-colors">
            <ArrowLeft size={16} /> All Policy Pillars
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
              <Icon size={24} className="text-gold" />
            </div>
            <span className="text-xs bg-white/10 text-white/50 px-3 py-1 rounded-full">Pillar {pillar.priority} of 20</span>
          </div>
          <h1 className="font-display text-[clamp(28px,4vw,40px)] font-bold text-white mb-4">{pillar.title}</h1>
          <p className="text-white/50 text-lg leading-relaxed">{pillar.description}</p>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-3xl">
          <h2 className="font-display text-xl font-bold text-navy mb-6">Why This Pillar Matters</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{pillar.description} Without sustained progress in this area, Haiti&apos;s broader transformation cannot succeed. This pillar is interconnected with every other dimension of the national development framework — progress here enables progress everywhere.</p>
          <p className="text-gray-600 leading-relaxed">Haiti 2077 invites citizens, professionals, diaspora members, and organizations to contribute structured proposals addressing the challenges and opportunities within this pillar.</p>
        </div>
      </section>

      {/* Related Proposals */}
      {pillarProposals.length > 0 && (
        <section className="py-section bg-gray-50/50">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-xl font-bold text-navy mb-6">Citizen Proposals for This Pillar</h2>
            <div className="space-y-4">
              {pillarProposals.map((p: any) => (
                <Link key={p.id} href={'/haiti-2077/proposals/' + p.id} className="block p-5 rounded-xl border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all bg-white">
                  <h3 className="text-sm font-semibold text-navy mb-1">{p.proposalTitle}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{p.problemAddressed}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-navy">
        <div className="section-container max-w-3xl text-center">
          <h3 className="font-display text-xl font-semibold text-white mb-3">Contribute to This Pillar</h3>
          <p className="text-white/40 text-sm mb-6">Have an idea related to {pillar.title.toLowerCase()}? Submit a structured proposal.</p>
          <Link href="/haiti-2077/contribute" className="bg-gold hover:bg-gold-300 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2">Submit a Proposal <ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* Prev/Next Navigation */}
      <section className="py-8 bg-white border-t border-gray-100">
        <div className="section-container max-w-3xl flex justify-between">
          {prev ? (
            <Link href={'/haiti-2077/pillars/' + prev.slug} className="text-sm text-navy hover:text-gold transition-colors flex items-center gap-2"><ArrowLeft size={14} /> {prev.title}</Link>
          ) : <div />}
          {next ? (
            <Link href={'/haiti-2077/pillars/' + next.slug} className="text-sm text-navy hover:text-gold transition-colors flex items-center gap-2">{next.title} <ArrowRight size={14} /></Link>
          ) : <div />}
        </div>
      </section>
    </div>
  );
}
