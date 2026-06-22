import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { getBlogPost, getBlogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { ShareButtons } from '@/components/ui/share-buttons';
import { ReadingProgress } from '@/components/ui/reading-progress';
import type { ContentBlock } from '@/types';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [post, allPosts] = await Promise.all([getBlogPost(params.slug), getBlogPosts()]);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      authors: ['Dieulin Napoleon'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'h':
      return (
        <h2 key={index} className="font-display text-2xl font-semibold text-navy mt-10 mb-4">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={index} className="font-display text-xl font-semibold text-navy mt-7 mb-3">
          {block.text}
        </h3>
      );
    case 'note':
      return (
        <div key={index} className="mt-12 p-5 bg-gold-muted rounded-xl border-l-4 border-gold">
          <p className="text-sm text-gray-600 italic leading-relaxed">{block.text}</p>
        </div>
      );
    case 'quote':
      return (
        <blockquote key={index} className="mt-6 mb-6 pl-6 border-l-4 border-gold-200 italic text-gray-600 leading-relaxed">
          {block.text}
        </blockquote>
      );
    case 'list':
      return (
        <ul key={index} className="mt-4 mb-6 space-y-2 ml-6">
          {block.items?.map((item, i) => (
            <li key={i} className="text-[17px] text-gray-700 leading-relaxed list-disc">{item}</li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div key={index} className="mt-6 mb-8 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            {block.headers && (
              <thead>
                <tr className="bg-navy text-white">
                  {block.headers.map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left font-semibold text-[13px] tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows?.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={'px-4 py-3 text-gray-700 text-[13px] leading-relaxed' + (ci === 0 ? ' font-medium text-navy' : '')}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.caption && <p className="px-4 py-2 text-[11px] text-gray-400 border-t border-gray-100 bg-gray-50">{block.caption}</p>}
        </div>
      );
    case 'image':
      return (
        <figure key={index} className="mt-6 mb-8">
          <img src={block.src} alt={block.alt || ''} className="w-full rounded-xl border border-gray-100" />
          {block.caption && <figcaption className="mt-2 text-center text-[12px] text-gray-400 italic">{block.caption}</figcaption>}
        </figure>
      );
    case 'link':
      return (
        <div key={index} className="mt-4 mb-6">
          <a href={block.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold/10 text-gold font-semibold text-sm hover:bg-gold/20 transition-colors">
            {block.label || block.text || 'Learn more'} &rarr;
          </a>
        </div>
      );
    case 'callout':
      return (
        <div key={index} className="mt-6 mb-8 p-5 rounded-xl bg-navy/5 border border-navy/10">
          <p className="text-[15px] text-navy font-medium leading-relaxed">{block.text}</p>
        </div>
      );
    default:
      return (
        <p key={index} className="text-[17px] text-gray-700 leading-[1.9] mb-5">
          {block.text}
        </p>
      );
  }
}

export default async function ArticlePage({ params }: Props) {
  const [post, allPosts] = await Promise.all([getBlogPost(params.slug), getBlogPosts()]);

  if (!post) notFound();

  // JSON-LD for Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: 'Dieulin Napoleon',
      url: 'https://dieulinnapoleon.com',
    },
    keywords: post.tags.join(', '),
  };

  const content = (post.content as ContentBlock[]) ?? [];

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Header */}
      <section className="page-header pb-12">
        <div className="section-container max-w-article mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/15 px-2.5 py-1 rounded">
              {post.category}
            </span>
            <span className="text-sm text-white/40 flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(post.created_at)}
            </span>
            <span className="text-sm text-white/40 flex items-center gap-1.5">
              <Clock size={14} />
              {post.read_time} read
            </span>
          </div>
          <h1 className="font-display text-[clamp(1.75rem,5vw,2.75rem)] font-bold text-white leading-tight text-center mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-display text-sm font-bold text-white">
              DN
            </div>
            <span className="text-sm text-white/60">Dieulin Napoleon</span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-section-sm">
        <div className="section-container max-w-article mx-auto">
          {/* Back link */}
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-gold text-sm font-semibold mb-10 hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Insights
          </Link>

          {/* Content */}
          {content.length > 0 ? (
            <article className="prose-custom">
              {(typeof content === 'string' ? JSON.parse(content) : content).map((block: ContentBlock, i: number) => renderBlock(block, i))}
            </article>
          ) : (
            <div>
              <p className="text-[17px] text-gray-700 leading-[1.9] mb-5">{post.excerpt}</p>
              <div className="p-8 bg-gray-50 rounded-2xl text-center mt-8">
                <p className="text-gray-500">Full article coming soon.</p>
              </div>
            </div>
          )}

                    <ShareButtons slug={post.slug} title={post.title} />

          {/* Tags */}
          <div className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                #{t}
              </span>
            ))}
          </div>

          {/* Author Card */}
          <div className="mt-10 p-7 bg-gray-50 rounded-2xl flex gap-5 items-center flex-wrap">
            <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center font-display text-xl font-bold text-white shrink-0">
              DN
            </div>
            <div className="flex-1 min-w-[200px]">
              <h4 className="font-display text-base font-semibold text-navy mb-1">Dieulin Napoleon</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Finance professional, entrepreneur, and project strategist. Master of Finance &amp; Impact MBA from Colorado State University.
              </p>
            </div>
          </div>


          {/* Related Posts */}
          {(() => {
            const related = allPosts.filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags?.some((t) => post.tags?.includes(t)))).slice(0, 3);
            if (related.length === 0) return null;
            return (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="font-display text-xl font-bold text-navy mb-6">Related Insights</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {related.map((r) => (
                    <Link key={r.id} href={'/insights/' + r.slug} className="group p-5 rounded-xl border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all">
                      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-gold">{r.category}</span>
                      <h4 className="font-display text-sm font-semibold text-navy mt-1 mb-2 group-hover:text-gold transition-colors leading-snug">{r.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2">{r.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link href="/insights">
              <Button variant="outline">Browse All Insights <ArrowRight size={16} /></Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
