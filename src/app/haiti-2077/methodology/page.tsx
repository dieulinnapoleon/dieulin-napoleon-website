import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Users, Target, Shield, CheckCircle, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Methodology | Haiti 2077 — How the Vision Is Built',
  description: 'Haiti 2077 is built on civic participation, structured policy analysis, nonpartisan principles, and a 50-year development timeline. Learn how the framework is designed, how proposals are evaluated, and how citizens can contribute.',
  openGraph: { title: 'Methodology | Haiti 2077', description: 'How the 50-year civic vision is designed, structured, and built through citizen participation.', images: [{ url: '/images/Dieulin-website.jpg' }] },
};

export default function MethodologyPage() {
  return (
    <div>
      <section className="page-header">
        <div className="section-container">
          <Link href="/haiti-2077" className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-6 hover:text-gold-300 transition-colors"><ArrowLeft size={16} /> Haiti 2077</Link>
          <h1 className="page-header-title">Methodology</h1>
          <p className="page-header-subtitle">How the Haiti 2077 civic vision is designed, structured, and built through citizen participation.</p>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-navy mb-6">What Haiti 2077 Is</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">Haiti 2077 is a nonpartisan civic reflection initiative. It is not a political party, a campaign platform, or a government program. It is an open framework for organizing long-term ideas about Haiti&apos;s national transformation, built by and for Haitian citizens, professionals, diaspora members, and organizations.</p>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">The initiative is grounded in a simple conviction: Haiti&apos;s transformation requires a shared vision that transcends individual administrations, aligns the efforts of all actors, and commits to measurable progress over decades rather than election cycles.</p>
          <p className="text-gray-600 text-lg leading-relaxed">Haiti 2077 does not claim to have all the answers. It provides a structure for collecting, organizing, and publishing the best thinking available from every corner of the Haitian community — inside the country and across the diaspora.</p>
        </div>
      </section>

      <section className="py-section bg-gray-50/50">
        <div className="section-container max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-navy mb-8">Core Principles</h2>
          <div className="space-y-6">
            {[
              { icon: Shield, title: 'Nonpartisan', desc: 'Haiti 2077 is not affiliated with any political party, candidate, or government. It welcomes contributions from all perspectives, provided they are respectful and constructive.' },
              { icon: Users, title: 'Citizen-Driven', desc: 'The framework is built from the bottom up. Every citizen, professional, student, entrepreneur, and diaspora member can submit proposals. The best ideas come from the people closest to the problems.' },
              { icon: Clock, title: 'Long-Term Orientation', desc: 'All proposals are evaluated on a 5-to-50-year horizon. Short-term political calculations have no place here. The goal is structural transformation, not electoral positioning.' },
              { icon: BookOpen, title: 'Evidence-Based', desc: 'Proposals are encouraged to cite sources, reference data, and draw on comparative examples from other countries. Opinion is welcome; informed opinion is better.' },
              { icon: Target, title: 'Action-Oriented', desc: 'Every proposal must identify a specific problem, propose a concrete solution, describe expected impact, and name the actors responsible for implementation. Vague aspirations are not sufficient.' },
              { icon: CheckCircle, title: 'Transparent Review', desc: 'All submissions are reviewed before publication. The review process assesses clarity, constructiveness, and adherence to submission guidelines. It does not filter for political alignment.' },
            ].map((p, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 mt-1">
                  <p.icon size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-navy mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-navy mb-8">The 20-Pillar Framework</h2>
          <p className="text-gray-600 leading-relaxed mb-6">Haiti 2077 organizes its vision around 20 policy pillars, each representing a critical dimension of national development. These pillars are not isolated silos — they are deeply interconnected. Progress in education enables economic growth. Infrastructure investment supports tourism. Agricultural modernization reduces poverty. Governance reform underpins everything.</p>
          <p className="text-gray-600 leading-relaxed mb-6">The pillars were selected based on analysis of Haiti&apos;s historical development challenges, comparative study of successful national transformation cases (South Korea, Rwanda, the Dominican Republic, Singapore), and the priorities identified by Haitian development stakeholders over decades of published research.</p>
          <p className="text-gray-600 leading-relaxed">Each pillar has its own dedicated page where citizens can explore the challenges, view submitted proposals, and contribute their own ideas.</p>
          <div className="mt-6">
            <Link href="/haiti-2077#pillars" className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:text-navy transition-colors">View All 20 Pillars <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <section className="py-section bg-gray-50/50">
        <div className="section-container max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-navy mb-8">The 50-Year Timeline</h2>
          <p className="text-gray-600 leading-relaxed mb-8">Transformation does not happen in a single presidential term. Haiti 2077 structures its vision across four phases spanning 50 years, from 2027 to 2077.</p>
          <div className="space-y-6">
            {[
              { period: '2027–2032', title: 'Stabilization and Institutional Recovery', desc: 'Restore basic security, rebuild core institutions, establish rule of law foundations, and create the national development planning framework.' },
              { period: '2033–2045', title: 'Foundations for Growth', desc: 'Invest systematically in education, agriculture, energy, healthcare, and the legal frameworks that enable private-sector-led growth.' },
              { period: '2046–2060', title: 'Industrialization and Modernization', desc: 'Build domestic productive capacity, digital infrastructure, urban planning, export capacity, and regional trade integration.' },
              { period: '2061–2077', title: 'Regional Leadership and Shared Prosperity', desc: 'Achieve advanced institutional quality, innovation-driven growth, universal public services, and Caribbean leadership.' },
            ].map((t, i) => (
              <div key={i} className="p-5 rounded-xl border border-gray-100 bg-white">
                <p className="text-xs font-bold text-gold tracking-wide uppercase mb-1">{t.period}</p>
                <h3 className="font-display font-semibold text-navy mb-2">{t.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-navy mb-6">How Proposals Are Evaluated</h2>
          <p className="text-gray-600 leading-relaxed mb-6">Every submitted proposal is reviewed against the following criteria:</p>
          <div className="space-y-3 mb-8">
            {[
              'Does it address a real, documented problem?',
              'Is the proposed solution specific and actionable?',
              'Is the expected impact clearly described?',
              'Does it identify who should implement it?',
              'Is it respectful, constructive, and nonpartisan?',
              'Does it reference evidence, data, or comparable examples where possible?',
              'Is it aligned with the long-term (5-50 year) orientation of Haiti 2077?',
            ].map((q, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={16} className="text-gold shrink-0 mt-1" />
                <p className="text-sm text-gray-600">{q}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed">Proposals that meet these criteria are published on the platform with appropriate attribution (based on contributor permission). Proposals that need refinement may receive feedback. Proposals that violate submission guidelines (hate speech, personal attacks, partisan propaganda) are rejected.</p>
        </div>
      </section>

      <section className="py-12 bg-navy">
        <div className="section-container max-w-3xl text-center">
          <h3 className="font-display text-2xl font-semibold text-white mb-4">Ready to Contribute?</h3>
          <p className="text-white/50 text-base mb-8 max-w-xl mx-auto">Your structured ideas can help shape Haiti&apos;s future. Every proposal matters.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/haiti-2077/contribute" className="bg-gold hover:bg-gold-300 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">Submit a Proposal <ArrowRight size={14} /></Link>
            <Link href="/haiti-2077/proposals" className="border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">View Proposals</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
