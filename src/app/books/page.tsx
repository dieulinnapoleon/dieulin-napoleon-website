import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBooks } from '@/lib/data';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Books & Publications',
  description: 'Upcoming books by Dieulin Napoleon on mindset, leadership, faith, and breaking barriers.',
};

const COLORS = [
  { color: 'from-gold/20 to-amber-100', accent: 'text-gold', border: 'border-gold/30' },
  { color: 'from-blue-50 to-indigo-50', accent: 'text-blue-600', border: 'border-blue-200' },
  { color: 'from-emerald-50 to-teal-50', accent: 'text-emerald-600', border: 'border-emerald-200' },
  { color: 'from-purple-50 to-fuchsia-50', accent: 'text-purple-600', border: 'border-purple-200' },
  { color: 'from-rose-50 to-pink-50', accent: 'text-rose-600', border: 'border-rose-200' },
];

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <>
      <section className="bg-navy pt-32 pb-16">
        <div className="section-container text-center">
          <p className="page-header-label">Publications</p>
          <h1 className="font-display text-[clamp(32px,5vw,48px)] font-bold text-white mb-4">Books & Upcoming Works</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Ideas shaped by experience, faith, and a deep belief that every person — regardless of origin — carries the potential to build something extraordinary.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="section-container max-w-4xl">
          <div className="space-y-8">
            {books.map((book, i) => {
              const style = COLORS[i % COLORS.length];
              return (
                <div key={book.id} className={'rounded-2xl border overflow-hidden ' + style.border}>
                  <div className={'bg-gradient-to-r p-8 ' + style.color}>
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-20 rounded-lg bg-white shadow-md flex items-center justify-center shrink-0">
                        <BookOpen size={28} className={style.accent} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={'text-xs font-bold tracking-[0.1em] uppercase ' + style.accent}>{book.theme}</span>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-white/80 px-2.5 py-0.5 rounded-full">
                            {book.status === 'In Progress' ? <Clock size={12} /> : <Sparkles size={12} />}
                            {book.status}
                          </span>
                        </div>
                        <h2 className="font-display text-xl font-bold text-navy leading-tight">{book.title}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 bg-white">
                    <p className="text-gray-600 leading-relaxed mb-6">{book.description}</p>
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-gold mb-3">Key Themes</p>
                      <div className="flex flex-wrap gap-2">
                        {book.topics.map((topic, j) => (
                          <span key={j} className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-100">{topic}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center p-12 rounded-2xl bg-navy">
            <h3 className="font-display text-2xl font-semibold text-white mb-3">Interested in These Books?</h3>
            <p className="text-white/50 mb-6">Subscribe to be notified when they are available, or reach out to discuss collaboration, publishing, or speaking opportunities.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/contact"><Button className="bg-gold hover:bg-gold-300 text-white">Get in Touch <ArrowRight size={16} /></Button></Link>
              <Link href="/"><Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-navy">Back to Home</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
