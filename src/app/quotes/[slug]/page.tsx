import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Quote as QuoteIcon, ArrowRight } from 'lucide-react';
import { getPublishedQuotes, getQuoteBySlug } from '@/lib/data';
import { ShareButtons } from '@/components/ui/share-buttons';
import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateStaticParams() {
  const quotes = await getPublishedQuotes();
  return quotes.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const quote = await getQuoteBySlug(params.slug);
  if (!quote) return { title: 'Quote Not Found' };
  const desc = '"' + quote.text + '" — ' + (quote.author || 'Dieulin Napoleon');
  return {
    title: desc.substring(0, 60) + ' | Dieulin Napoleon',
    description: desc,
    openGraph: {
      title: desc.substring(0, 60),
      description: desc,
      type: 'article',
      url: 'https://dieulinnapoleon.com/quotes/' + quote.slug,
      images: [{ url: '/images/Dieulin-website.jpg', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: desc.substring(0, 60), description: desc, images: ['/images/Dieulin-website.jpg'] },
  };
}

export default async function QuoteDetailPage({ params }: { params: { slug: string } }) {
  const quote = await getQuoteBySlug(params.slug);
  if (!quote) notFound();

  return (
    <div>
      <section className="bg-navy pt-32 pb-20">
        <div className="section-container max-w-3xl">
          <Link href="/quotes" className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-10 hover:text-gold-300 transition-colors">
            <ArrowLeft size={16} /> All Quotes
          </Link>
          <QuoteIcon size={40} className="text-gold/20 mb-6" />
          <p className="text-2xl md:text-3xl lg:text-4xl text-white font-display italic leading-relaxed mb-8">&ldquo;{quote.text}&rdquo;</p>
          <p className="text-gold font-medium text-lg">&mdash; {quote.author || 'Dieulin Napoleon'}</p>
          {quote.source && quote.source !== 'Original' && (
            <p className="text-white/30 text-sm mt-1">{quote.source}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-6">
            {quote.category && <span className="text-[11px] bg-white/10 text-white/50 px-3 py-1 rounded-full">{quote.category}</span>}
            {quote.tags?.map((tag: string) => (
              <span key={tag} className="text-[11px] bg-gold/10 text-gold/60 px-3 py-1 rounded-full">#{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="section-container max-w-3xl">
          <div className="notranslate" translate="no">
            <ShareButtons slug={quote.slug} title={quote.text.substring(0, 80)} />
          </div>

          <div className="mt-12 text-center p-10 rounded-2xl bg-navy">
            <h3 className="font-display text-xl font-semibold text-white mb-3">More Daily Motivation</h3>
            <p className="text-white/40 text-sm mb-6">Explore more reflections on growth, leadership, faith, and purpose.</p>
            <Link href="/quotes" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-300 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              View All Quotes <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
