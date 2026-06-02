import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Books & Publications',
  description: 'Upcoming books by Dieulin Napoleon on mindset, leadership, faith, and breaking barriers.',
};

const BOOKS = [
  {
    title: 'Cardboard Walls: Building the Mindset to Succeed from Anywhere',
    status: 'In Progress',
    theme: 'Mindset & Personal Development',
    description: 'If you can build a positive mindset and dream big, there is nothing that can prevent you from succeeding — no matter where you come from. This book explores how the barriers we face are rarely as solid as they appear, and why the sooner you build a mindset of possibility, the sooner everything changes. Drawing from personal experience growing up in Haiti to earning graduate degrees in the United States, this is a practical guide to breaking through the cardboard walls that hold us back.',
    topics: ['Positive mindset', 'Dreaming beyond circumstances', 'Resilience', 'From Haiti to the world', 'Turning obstacles into staircases'],
    color: 'from-gold/20 to-amber-100',
    accent: 'text-gold',
    border: 'border-gold/30',
  },
  {
    title: 'Beyond Barriers: Why Knowledge Has No Color, Race, or Gender',
    status: 'Coming Soon',
    theme: 'Leadership & Equity',
    description: 'Knowledge does not have a color, a race, or a sex — but society seems to make it easier for some people to access it. This book challenges the categorical barriers that limit human potential and argues that everyone can accomplish everything when they refuse to accept artificial limitations. A call to action for individuals, institutions, and systems to unlock talent wherever it exists.',
    topics: ['Universal access to knowledge', 'Breaking categorical barriers', 'Equity in education', 'Talent has no borders', 'Systemic change through individual action'],
    color: 'from-blue-50 to-indigo-50',
    accent: 'text-blue-600',
    border: 'border-blue-200',
  },
  {
    title: 'Put God First: The Formula That Always Works',
    status: 'Coming Soon',
    theme: 'Faith & Purpose',
    description: 'In a world obsessed with strategies, frameworks, and formulas for success, this book offers the simplest and most powerful one: put God first. Drawing on faith, personal testimony, and the intersection of spiritual discipline with professional ambition, this book explores how prioritizing purpose over profit creates a foundation that never fails.',
    topics: ['Faith-driven leadership', 'Purpose before profit', 'Spiritual discipline', 'The intersection of faith and ambition', 'Building on an unshakable foundation'],
    color: 'from-emerald-50 to-teal-50',
    accent: 'text-emerald-600',
    border: 'border-emerald-200',
  },
];

export default function BooksPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-navy pt-32 pb-16">
        <div className="section-container text-center">
          <p className="page-header-label">Publications</p>
          <h1 className="font-display text-[clamp(32px,5vw,48px)] font-bold text-white mb-4">Books & Upcoming Works</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Ideas shaped by experience, faith, and a deep belief that every person — regardless of origin — carries the potential to build something extraordinary.
          </p>
        </div>
      </section>

      {/* Books */}
      <section className="py-16">
        <div className="section-container max-w-4xl">
          <div className="space-y-8">
            {BOOKS.map((book, i) => (
              <div key={i} className={'rounded-2xl border overflow-hidden ' + book.border}>
                <div className={'bg-gradient-to-r p-8 ' + book.color}>
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-20 rounded-lg bg-white shadow-md flex items-center justify-center shrink-0">
                      <BookOpen size={28} className={book.accent} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={'text-xs font-bold tracking-[0.1em] uppercase ' + book.accent}>{book.theme}</span>
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
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center p-12 rounded-2xl bg-navy">
            <h3 className="font-display text-2xl font-semibold text-white mb-3">Interested in These Books?</h3>
            <p className="text-white/50 mb-6">Subscribe to be notified when they are available, or reach out to discuss collaboration, publishing, or speaking opportunities.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/contact">
                <Button className="bg-gold hover:bg-gold-300 text-white">Get in Touch <ArrowRight size={16} /></Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-navy">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
