import Link from 'next/link';
import { Quote as QuoteIcon, ArrowRight, Search } from 'lucide-react';
import { getPublishedQuotes, getDailyQuote } from '@/lib/data';
import { ShareButtons } from '@/components/ui/share-buttons';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Daily Motivation | Dieulin Napoleon',
  description: 'Positive reflections, motivation, and wisdom for personal growth, discipline, faith, leadership, resilience, and purpose.',
  openGraph: { title: 'Daily Motivation | Dieulin Napoleon', description: 'Positive reflections, motivation, and wisdom.' },
};

const CATEGORIES = ['All','Motivation','Discipline','Hope','Faith','Leadership','Entrepreneurship','Education','Haiti','Resilience','Purpose','Service','Growth','Patriotism','Family','Wisdom'];

export default async function QuotesPage() {
  const [quotes, daily] = await Promise.all([getPublishedQuotes(), getDailyQuote()]);

  return (
    <div>
      <section className="page-header">
        <div className="section-container">
          <p className="page-header-label">Quotes</p>
          <h1 className="page-header-title">Daily Motivation</h1>
          <p className="page-header-subtitle">Positive reflections, motivation, and wisdom for personal growth, discipline, faith, leadership, resilience, and purpose.</p>
        </div>
      </section>

      {/* Daily Quote */}
      {daily && (
        <section className="py-12 bg-navy">
          <div className="section-container max-w-3xl text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-6">Today&apos;s Reflection</p>
            <QuoteIcon size={32} className="text-gold/30 mx-auto mb-4" />
            <p className="text-xl md:text-2xl text-white font-display italic leading-relaxed mb-6">&ldquo;{daily.text}&rdquo;</p>
            <p className="text-gold/70 text-sm font-medium">&mdash; {daily.author || 'Dieulin Napoleon'}</p>
            {daily.slug && (
              <Link href={'/quotes/' + daily.slug} className="inline-flex items-center gap-1.5 mt-6 text-xs text-gold/50 hover:text-gold transition-colors">
                Share this quote <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </section>
      )}

      {/* All Quotes */}
      <section className="py-section bg-white">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quotes.map((q: any) => (
              <Link key={q.id} href={'/quotes/' + q.slug} className="group p-6 rounded-2xl border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all">
                <QuoteIcon size={18} className="text-gold/30 mb-3" />
                <p className="text-[15px] text-gray-700 italic leading-relaxed mb-4 line-clamp-4">&ldquo;{q.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gold font-medium">&mdash; {q.author || 'Dieulin Napoleon'}</p>
                  {q.category && <span className="text-[10px] bg-navy/5 text-navy/60 px-2 py-0.5 rounded-full">{q.category}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
