import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { researchItems, RESEARCH_DISCLAIMER } from '@/lib/research-data';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return researchItems.filter((r) => r.published).map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = researchItems.find((x) => x.slug === params.slug && x.published);
  if (!r) return { title: 'Research Not Found' };
  const title = r.title + ' | Dieulin Napoleon';
  return {
    title,
    description: r.summary,
    openGraph: {
      title,
      description: r.summary,
      type: 'article',
      url: 'https://dieulinnapoleon.com/research/' + r.slug,
      images: [{ url: '/images/Dieulin-website.jpg', width: 1200, height: 630 }],
    },
  };
}

export default function ResearchDetailPage({ params }: { params: { slug: string } }) {
  const r = researchItems.find((x) => x.slug === params.slug && x.published);
  if (!r) notFound();

  return (
    <div>
      <section className="bg-navy pt-32 pb-16">
        <div className="section-container max-w-3xl">
          <Link href="/research" className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-8 hover:text-gold-300 transition-colors">
            <ArrowLeft size={16} /> All Research
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold bg-gold/10 px-2.5 py-1 rounded-md">{r.type}</span>
            {r.ticker && <span className="text-[11px] text-white/60 bg-white/10 px-2.5 py-1 rounded-md font-medium">{r.ticker}</span>}
            {r.date && <span className="text-[11px] text-white/40">{r.date}</span>}
          </div>
          <h1 className="font-display text-[clamp(26px,4vw,38px)] font-bold text-white mb-3">{r.title}</h1>
          <p className="text-white/50">{r.company}{r.sector ? ' · ' + r.sector : ''}</p>

          {(r.recommendation || r.targetPrice) && (
            <div className="grid grid-cols-2 gap-3 mt-8 max-w-md">
              {r.recommendation && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold mb-1">Recommendation</p>
                  <p className="text-white font-semibold">{r.recommendation}</p>
                </div>
              )}
              {r.targetPrice && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold mb-1">Target Price</p>
                  <p className="text-white font-semibold">{r.targetPrice}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-3xl space-y-10">
          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Summary</h2>
            <p className="text-gray-600 leading-relaxed">{r.summary}</p>
          </div>

          {r.thesis && r.thesis.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-navy mb-4">Investment Thesis</h2>
              <div className="space-y-3">
                {r.thesis.map((t, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-gold/5 border border-gold/10">
                    <span className="w-6 h-6 rounded-full bg-gold/15 text-gold text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-4">Methodology</h2>
            <div className="space-y-2">
              {r.methodology.map((m, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle size={16} className="text-gold shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">{m}</p>
                </div>
              ))}
            </div>
          </div>

          {r.keyTakeaways && r.keyTakeaways.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-navy mb-4">Key Takeaways</h2>
              <div className="space-y-2">
                {r.keyTakeaways.map((k, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy/40 shrink-0 mt-2" />
                    <p className="text-sm text-gray-600">{k}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-4">Skills Demonstrated</h2>
            <div className="flex flex-wrap gap-2">
              {r.skills.map((s) => (
                <span key={s} className="text-xs bg-navy/5 text-navy/70 px-3 py-1.5 rounded-lg">{s}</span>
              ))}
            </div>
          </div>

          {r.pdfUrl && (
            <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-300 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
              <FileText size={16} /> Download Full Report (PDF)
            </a>
          )}

          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 flex gap-3">
            <AlertTriangle size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">{RESEARCH_DISCLAIMER}</p>
          </div>

          <div className="text-center p-10 rounded-2xl bg-navy">
            <h3 className="font-display text-xl font-semibold text-white mb-3">Interested in My Work?</h3>
            <p className="text-white/40 text-sm mb-6">I&apos;m open to opportunities in investment research, corporate finance, and impact-driven strategy.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/contact" className="bg-gold hover:bg-gold-300 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2">Get in Touch <ArrowRight size={14} /></Link>
              <Link href="/cv" className="border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">View CV</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
