import Link from 'next/link';
import { ArrowRight, Target, Clock, MapPin, Users, Lightbulb, Shield, GraduationCap, Heart, Truck, Building2, Zap, Droplets, Cpu, TreePine, Factory, Globe, Flag, CloudRain, Banknote } from 'lucide-react';
import { getPillars, getDepartments, getTimeline } from '@/lib/data';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Haiti 2077 — A 50-Year Civic Vision for National Transformation',
  description: 'A nonpartisan civic reflection initiative inviting Haitians, diaspora members, professionals, students, entrepreneurs, educators, and policymakers to contribute structured ideas for Haiti long-term transformation.',
  openGraph: { title: 'Haiti 2077', description: 'A 50-Year Civic Vision for National Transformation', images: [{ url: '/images/Dieulin-website.jpg' }] },
};

const ICONS: Record<string, any> = { Landmark: Target, Shield, GraduationCap, Heart, Wheat: Lightbulb, Truck, Building2, Zap, Droplets, Cpu, TreePine, Palmtree: Globe, Factory, Banknote, Globe, ArrowLeftRight: ArrowRight, Users, CloudRain, MapPin, Flag };

export default function Haiti2077Page() {
  const pillars = getPillars();
  const departments = getDepartments();
  const timeline = getTimeline();

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy pt-32 pb-20">
        <div className="section-container text-center max-w-4xl">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-gold mb-4">Civic Reflection Initiative</p>
          <h1 className="font-display text-[clamp(36px,5vw,56px)] font-bold text-white mb-4">Haiti 2077</h1>
          <p className="text-xl text-gold/80 font-display italic mb-6">A 50-Year Civic Vision for National Transformation</p>
          <p className="text-white/50 text-base leading-relaxed max-w-2xl mx-auto mb-10">Haiti 2077 is a nonpartisan civic reflection initiative dedicated to organizing long-term ideas, policy priorities, and citizen contributions around Haiti&apos;s transformation over the next five decades.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#pillars" className="bg-gold hover:bg-gold-300 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">Explore the Vision</a>
            <Link href="/haiti-2077/contribute" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">Submit an Idea</Link>
            <Link href="/haiti-2077/proposals" className="border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">View Proposals</Link>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-section bg-white">
        <div className="section-container max-w-3xl">
          <h2 className="font-display text-section-title font-bold text-navy text-center mb-8">Why This Initiative Matters</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">Haiti has spent decades responding to crises without ever building the long-term institutional and strategic framework that would prevent them. Electoral cycles reward short-term thinking. International aid arrives according to donor priorities rather than national priorities. Fragmented projects address symptoms without transforming systems.</p>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">Haiti 2077 is built on a simple conviction: sustained national transformation requires a shared vision that transcends individual administrations, aligns the efforts of all actors, and commits to measurable progress over decades, not election cycles.</p>
          <p className="text-gray-600 text-lg leading-relaxed">This is not a political campaign. It is an invitation to every Haitian citizen, professional, entrepreneur, educator, faith leader, and policymaker to participate in serious, constructive, long-term reflection about the country&apos;s future.</p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-section bg-gray-50/50">
        <div className="section-container max-w-3xl">
          <h2 className="font-display text-section-title font-bold text-navy text-center mb-12">50-Year Transformation Timeline</h2>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gold/20" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center shrink-0 z-10">
                    <Clock size={16} className="text-gold" />
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-bold text-gold tracking-wide uppercase">{t.period}</p>
                    <h3 className="font-display text-lg font-semibold text-navy mt-1 mb-2">{t.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Policy Pillars */}
      <section id="pillars" className="py-section bg-white">
        <div className="section-container">
          <h2 className="font-display text-section-title font-bold text-navy text-center mb-4">20 Policy Pillars</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">Each pillar represents a critical dimension of Haiti&apos;s long-term transformation. Together, they form a comprehensive national development framework.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p, i) => {
              const Icon = ICONS[p.icon] || Target;
              return (
                <div key={i} className="p-5 rounded-xl border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-navy mb-1.5">{p.title}</h3>
                  <p className="text-[12px] text-gray-400 leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-section bg-gray-50/50">
        <div className="section-container">
          <h2 className="font-display text-section-title font-bold text-navy text-center mb-4">Haiti&apos;s 10 Departments</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">Each department has unique assets, challenges, and development potential. A national vision must account for regional diversity.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {departments.map((d, i) => (
              <div key={i} className="p-5 rounded-xl border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all bg-white">
                <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center mb-3">
                  <MapPin size={16} className="text-navy/50" />
                </div>
                <h3 className="font-display text-sm font-semibold text-navy mb-1">{d.name}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-2">{d.description.substring(0, 100)}...</p>
                <div className="flex flex-wrap gap-1">
                  {d.prioritySectors.slice(0, 3).map((s, si) => (
                    <span key={si} className="text-[9px] bg-gold/5 text-gold/70 px-1.5 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribution CTA */}
      <section className="py-section bg-navy">
        <div className="section-container max-w-3xl text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-4">Contribute to Haiti&apos;s Future</h2>
          <p className="text-white/50 text-base leading-relaxed mb-4 max-w-xl mx-auto">Haiti 2077 invites constructive, respectful, and long-term ideas from every citizen who believes in Haiti&apos;s transformation.</p>
          <p className="text-white/30 text-sm mb-8 max-w-lg mx-auto">All submissions are reviewed before publication. Contributors choose whether their name appears publicly. No hate speech, personal attacks, or partisan propaganda.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/haiti-2077/contribute" className="bg-gold hover:bg-gold-300 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">Submit a Proposal <ArrowRight size={14} /></Link>
            <Link href="/haiti-2077/proposals" className="border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">View Approved Proposals</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
