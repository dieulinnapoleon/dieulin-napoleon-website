import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/data';
import { InsightsClient } from './insights-client';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Perspectives on finance, entrepreneurship, project management, sustainability, and development by Dieulin Napoleon.',
  openGraph: {
    title: 'Insights | Dieulin Napoleon',
    description: 'Perspectives on finance, entrepreneurship, project management, sustainability, and development.',
  },
};

export const revalidate = 60; // ISR: revalidate every hour

export default async function InsightsPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      {/* Header */}
      <section className="page-header">
        <div className="section-container">
          <p className="page-header-label">Blog</p>
          <h1 className="page-header-title">Insights</h1>
          <p className="page-header-subtitle">
            Perspectives on finance, entrepreneurship, project management, sustainability, and development.
          </p>
        </div>
      </section>

      {/* Client-side filtering */}
      <InsightsClient posts={posts} />
    </div>
  );
}
