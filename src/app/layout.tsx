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
    'Dieulin Napoleon', 'Napoleon Dieulin', 'Dieulin', 'Napoleon',
    'Dieulin Napoleon finance', 'Dieulin Napoleon Haiti', 'Dieulin Napoleon CSU',
    'finance professional', 'entrepreneur Haiti', 'impact investing',
    'Colorado State University MBA', 'CFA candidate', 'project management',
    'sustainability', 'ESG', 'fintech', 'Creasti', 'FINANCEM', 'PATRIYA', 'LINEON',
    'Haitian entrepreneur', 'dieulinnapoleon',
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
  alternateName: ['Napoleon Dieulin', 'Dieulin', 'DN'],
  url: 'https://dieulinnapoleon.com',
  image: 'https://dieulinnapoleon.com/images/Dieulin-website.jpg',
  jobTitle: 'Finance Professional & Entrepreneur',
  description: 'Finance professional, entrepreneur, and project strategist with four graduate degrees including a Master of Finance and Impact MBA from Colorado State University.',
  nationality: { '@type': 'Country', name: 'Haiti' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Colorado State University', department: 'College of Business' },
    { '@type': 'CollegeOrUniversity', name: 'Universidad Para la Cooperacion Internacional' },
    { '@type': 'CollegeOrUniversity', name: 'ISTEAH' },
    { '@type': 'CollegeOrUniversity', name: 'Universite Publique du Nord au Cap-Haitien' },
  ],
  knowsAbout: ['Finance', 'Entrepreneurship', 'Project Management', 'ESG', 'Impact Investing', 'Sustainability', 'Haiti', 'Valuation', 'CFA'],
  knowsLanguage: ['English', 'French', 'Haitian Creole', 'Spanish'],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', name: 'Master of Finance', credentialCategory: 'degree' },
    { '@type': 'EducationalOccupationalCredential', name: 'Impact MBA', credentialCategory: 'degree' },
    { '@type': 'EducationalOccupationalCredential', name: 'CFA Level I Candidate', credentialCategory: 'certificate' },
  ],
  sameAs: [
    'https://www.linkedin.com/in/dieulinnapoleon/',
    'https://napoleondieulin.blogspot.com/',
  ],
  worksFor: [
    { '@type': 'Organization', name: 'Creasti' },
    { '@type': 'Organization', name: 'GACED Consulting' },
  ],
};

import { TranslationProvider } from '@/lib/translation';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="O3sVYmyO6JoLIYBWPlHtL60u2Vej3KBi69AXsyTc9w8" />
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
