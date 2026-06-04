import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Target, Compass, Globe2, GraduationCap, Heart, Sparkles, Award, Trophy, BookOpen, Briefcase, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedStat } from '@/components/ui/animated-stat';
import { getCVData } from '@/lib/data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Dieulin Napoleon — finance professional, entrepreneur, and project strategist building at the intersection of capital markets, technology, and social impact.',
};

export default async function AboutPage() {
  const cv = await getCVData();

  return (
    <div>
      {/* Header */}
      <section className="page-header">
        <div className="section-container">
          <p className="page-header-label">About</p>
          <h1 className="page-header-title">The Story Behind the Work</h1>
          <p className="page-header-subtitle">Finance, entrepreneurship, and impact — a journey rooted in Haiti with global reach.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-section bg-white">
        <div className="section-container max-w-article mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            I am a finance professional and entrepreneur with four graduate degrees — including a Master of Finance and Impact MBA from Colorado State University,
            United States. My career sits at the intersection of rigorous financial analysis, entrepreneurial
            action, sustainability strategy, and a deep commitment to creating impact in underserved markets — particularly Haiti.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Over the past decade, I have worked as a university lecturer, government advisor, consulting firm leader, and graduate
            researcher — always guided by the belief that knowledge, capital, and technology can be directed toward meaningful
            social and economic outcomes.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Today I am building technology-enabled ventures — including Creasti (a gamified savings app), FINANCEM (a digital wallet
            for Haiti), PATRIYA (a civic education platform), and LINEON Group (a real estate marketplace) — while completing my
            graduate studies and pursuing the CFA designation.
          </p>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="py-12 bg-gray-50/50 border-y border-gray-100">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <AnimatedStat value={4} label="Graduate Degrees" icon={<GraduationCap size={22} className="text-gold" />} />
            <AnimatedStat value={6} label="Ventures Built" icon={<Briefcase size={22} className="text-gold" />} />
            <AnimatedStat value={4} label="Universities Taught" icon={<BookOpen size={22} className="text-gold" />} />
            <AnimatedStat value={11} suffix="+" label="Years Experience" icon={<Calendar size={22} className="text-gold" />} />
            <AnimatedStat value={4} label="Languages Spoken" icon={<Globe2 size={22} className="text-gold" />} />
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-section bg-white">
        <div className="section-container">
          <h2 className="font-display text-section-title font-bold text-navy text-center mb-12">
            What Drives My Work
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Finance & Investment', desc: 'Rigorous financial analysis, valuation, and investment research grounded in academic training and real-world application.' },
              { icon: Sparkles, title: 'Entrepreneurship', desc: 'Building technology-enabled ventures that solve real problems — from financial inclusion to civic education.' },
              { icon: Compass, title: 'Project Management', desc: 'End-to-end project planning and execution for complex initiatives across sectors and geographies.' },
              { icon: Globe2, title: 'Haiti & Emerging Markets', desc: 'Deep expertise in the Haitian market, diaspora engagement, and development economics.' },
              { icon: Heart, title: 'Sustainability & ESG', desc: 'Corporate sustainability strategy, GHG inventories, and decarbonization planning.' },
              { icon: GraduationCap, title: 'Education & Leadership', desc: 'A decade of university teaching and mentorship across four institutions in Haiti.' },
            ].map((area, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                  <area.icon size={20} className="text-gold" />
                </div>
                <h3 className="font-display font-semibold text-navy mb-2">{area.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-section bg-gray-50/50">
        <div className="section-container max-w-3xl">
          <h2 className="font-display text-section-title font-bold text-navy text-center mb-12">Professional Journey</h2>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gold/20" />
            <div className="space-y-8">
              {cv.experience.map((exp, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center shrink-0 z-10">
                    <Briefcase size={16} className="text-gold" />
                  </div>
                  <div className="pb-2">
                    <p className="text-xs font-bold text-gold tracking-wide uppercase">{exp.period}</p>
                    <h3 className="font-display font-semibold text-navy mt-1">{exp.title}</h3>
                    <p className="text-sm text-gray-500">{exp.organization}</p>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      {cv.awards && cv.awards.length > 0 && (
        <section className="py-section bg-white">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-section-title font-bold text-navy text-center mb-12">Awards & Recognition</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {cv.awards.map((award, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:border-gold/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Trophy size={18} className="text-gold" />
                  </div>
                  <p className="text-sm text-navy font-medium leading-relaxed">{award}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Haiti Section */}
      <section className="py-section bg-gray-50/50">
        <div className="section-container max-w-article mx-auto">
          <h2 className="font-display text-section-title font-bold text-navy mb-6">Rooted in Haiti</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Haiti is where my story begins and where much of my work returns. From teaching at four universities
            in Cap-Haïtien and Port-au-Prince to advising the National Port Authority to building technology
            platforms for financial inclusion and civic engagement — my professional life has been shaped by the
            challenges and possibilities of the country I come from.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            I believe deeply that Haiti's future depends on the intersection of education, entrepreneurship,
            technology, and committed leadership. That belief drives everything I build.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects">
              <Button className="bg-gold hover:bg-gold-300 text-white">Explore My Projects <ArrowRight size={16} /></Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-navy/20 text-navy hover:bg-navy hover:text-white">Get in Touch</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
