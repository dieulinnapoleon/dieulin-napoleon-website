import type { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dieulinnapoleon.com'),
  title: {
    default: 'Dieulin Napoleon | Finance · Impact · Strategy',
    template: '%s | Dieulin Napoleon',
  },
  description:
    'Finance professional, entrepreneur, and project strategist building at the intersection of capital markets, technology, and social impact.',
  keywords: [
    'Dieulin Napoleon', 'finance', 'entrepreneurship', 'project management',
    'impact investing', 'Haiti', 'Colorado State University', 'MBA', 'CFA',
    'sustainability', 'ESG', 'fintech', 'Creasti', 'FINANCEM',
  ],
  authors: [{ name: 'Dieulin Napoleon' }],
  creator: 'Dieulin Napoleon',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Dieulin Napoleon',
    title: 'Dieulin Napoleon | Finance · Impact · Strategy',
    description:
      'Finance professional, entrepreneur, and project strategist building at the intersection of capital markets, technology, and social impact.',
    images: [{ url: '/images/Dieulin-website.jpg', width: 1200, height: 630, alt: 'Dieulin Napoleon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dieulin Napoleon | Finance · Impact · Strategy',
    description: 'Finance, entrepreneurship, and social impact.',
    images: ['/images/Dieulin-website.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    languages: {
      'en': '/',
      'fr': '/fr',
      'ht': '/ht',
    },
  },
};

// JSON-LD structured data for Person
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dieulin Napoleon',
  url: 'https://dieulinnapoleon.com',
  jobTitle: 'Finance Professional & Entrepreneur',
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Colorado State University',
    },
  ],
  knowsAbout: ['Finance', 'Entrepreneurship', 'Project Management', 'ESG', 'Impact Investing'],
  sameAs: [
    'https://www.linkedin.com/in/dieulinnapoleon/',
  ],
};

import { TranslationProvider } from '@/lib/translation';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <TranslationProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </TranslationProvider>
              <Analytics />
      </body>
    </html>
  );
}
