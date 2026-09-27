import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <section className="page-header">
        <div className="section-container text-center">
          <p className="page-header-label">404</p>
          <h1 className="page-header-title">Page Not Found</h1>
          <p className="page-header-subtitle">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
        </div>
      </section>
      <section className="py-section bg-white">
        <div className="section-container flex flex-wrap justify-center gap-3">
          <Link href="/" className="bg-gold hover:bg-gold-300 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
            Back to Home
          </Link>
          <Link href="/insights" className="border border-navy/20 text-navy hover:bg-navy hover:text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
            Read Insights
          </Link>
          <Link href="/contact" className="border border-navy/20 text-navy hover:bg-navy hover:text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
