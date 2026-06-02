import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Target, Compass, Globe2, GraduationCap, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Dieulin Napoleon — finance professional, entrepreneur, and project strategist building at the intersection of capital markets, technology, and social impact.',
};

const FOCUS_AREAS = [
  { icon: Target, label: 'Corporate Finance & Investment Analysis' },
  { icon: Sparkles, label: 'Entrepreneurship & Startup Building' },
  { icon: Globe2, label: 'Sustainability & ESG Strategy' },
  { icon: Compass, label: 'Project Management & Feasibility' },
  { icon: GraduationCap, label: 'Financial Technology & Inclusion' },
  { icon: Heart, label: 'Haiti-Focused Innovation & Development' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="page-header">
        <div className="section-container">
          <p className="page-header-label">About</p>
          <h1 className="page-header-title">Who I Am</h1>
          <p className="page-header-subtitle">
            Finance professional, entrepreneur, and project strategist with a commitment to impact.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-section bg-white">
        <div className="section-container max-w-article mx-auto">
          <h2 className="font-display text-2xl font-semibold text-navy mb-6">My Story</h2>
          <p className="text-[17px] text-gray-700 leading-[1.9] mb-5">
            I am a Haitian-born finance professional, entrepreneur, and project strategist based in the
            United States. My career sits at the intersection of rigorous financial analysis, entrepreneurial
            action, sustainability, and social impact. I believe in building things that matter — ventures,
            strategies, and systems that create measurable value for individuals, communities, and institutions.
          </p>

          <h2 className="font-display text-2xl font-semibold text-navy mt-10 mb-6">The Journey</h2>
          <p className="text-[17px] text-gray-700 leading-[1.9] mb-5">
            My path has never been linear, and I consider that a strength. I started in business education
            and public administration in Haiti, where I taught, consulted, and advised on complex projects.
            I co-founded a consulting firm, worked with government institutions, and built deep expertise
            in feasibility studies, business planning, and project management.
          </p>
          <p className="text-[17px] text-gray-700 leading-[1.9] mb-5">
            I then pursued graduate studies in the United States, earning a Master of Finance and an Impact
            MBA from Colorado State University — where I deepened my skills in corporate finance, investment
            analysis, valuation, sustainability strategy, and entrepreneurship.
          </p>

          <h2 className="font-display text-2xl font-semibold text-navy mt-10 mb-6">Philosophy</h2>
          <p className="text-[17px] text-gray-700 leading-[1.9] mb-5">
            I believe that finance, when combined with purpose and discipline, is one of the most powerful
            tools for transformation. My approach combines analytical rigor with entrepreneurial thinking
            and a commitment to ethical, impact-driven outcomes. Whether I am analyzing an investment
            opportunity, building a startup, managing a project, or developing a sustainability strategy,
            I bring the same mindset: define the problem, quantify the opportunity, build the solution,
            and measure the impact.
          </p>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-section bg-gray-50/50">
        <div className="section-container">
          <h2 className="font-display text-section-title font-bold text-navy text-center mb-12">
            Areas of Focus
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {FOCUS_AREAS.map((area) => (
              <div key={area.label} className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center shrink-0">
                  <area.icon size={20} className="text-gold" />
                </div>
                <p className="text-sm font-medium text-navy leading-snug">{area.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Haiti Section */}
      <section className="py-section bg-white">
        <div className="section-container max-w-article mx-auto">
          <h2 className="font-display text-2xl font-semibold text-navy mb-6">
            Haiti &amp; Purpose
          </h2>
          <p className="text-[17px] text-gray-700 leading-[1.9] mb-5">
            Haiti is where I come from, and its challenges and possibilities are deeply personal to me.
            Several of my ventures — FINANCEM, PATRIYA, LINEON Group, ReSource Haiti — are designed
            specifically to address gaps in financial inclusion, civic education, real estate markets,
            and environmental management in Haiti. I am committed to building solutions that respect
            Haitian intelligence, creativity, and resilience while leveraging global best practices.
          </p>

          <div className="mt-12 text-center">
            <Link href="/projects">
              <Button>Explore My Projects <ArrowRight size={16} /></Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
