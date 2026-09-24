import Link from 'next/link';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { researchItems, RESEARCH_DISCLAIMER } from '@/lib/research-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investment Research | Dieulin Napoleon',
  description: 'Independent equity research and valuation work by Dieulin Napoleon, built from primary sources including SEC filings and discounted cash flow analysis.',
  openGraph: {
    title: 'Investment Research | Dieulin Napoleon',
    description: 'Independent equity research and valuation work built from primary sources.',
    images: [{ url: '/images/Dieulin-website.jpg', width: 1200, height: 630 }],
  },
};

export default function ResearchPage() {
  const items = researchItems.filter((r) => r.published);

  return (
    <div>
      <section className="page-header">
        <div className="section-container">
          <p className="page-header-label">Investment Research</p>
          <h1 className="page-header-title">Research &amp; Valuation</h1>
          <p className="page-header-subtitle">Independent equity research and valuation work built from primary sources.</p>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-4xl">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Research reports will be published here soon.</p>
          ) : (
            <div className="space-y-6">
              {items.map((r) => (
                <Link key={r.slug} href={'/research/' + r.slug} className="group block p-7 rounded-2xl border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold bg-gold/10 px-2.5 py-1 rounded-md">{r.type}</span>
                    {r.ticker && <span className="text-[11px] text-navy/60 bg-navy/5 px-2.5 py-1 rounded-md font-medium">{r.ticker}</span>}
                    {r.date && <span className="text-[11px] text-gray-400">{r.date}</span>}
                  </div>
                  <h2 className="font-display text-xl font-semibold text-navy group-hover:text-gold transition-colors mb-2">{r.title}</h2>
                  {r.sector && <p className="text-xs text-gray-400 mb-3">{r.sector}</p>}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{r.summary}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold">Read the analysis <ArrowRight size={14} /></span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 p-5 rounded-xl bg-gray-50 border border-gray-100 flex gap-3">
            <BarChart3 size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">{RESEARCH_DISCLAIMER}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
