import type { Metadata } from 'next';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Dieulin Napoleon for career opportunities, consulting, startup partnerships, speaking engagements, and more.',
};

export default function ContactPage() {
  return (
    <div>
      <section className="page-header">
        <div className="section-container">
          <p className="page-header-label">Connect</p>
          <h1 className="page-header-title">Get in Touch</h1>
          <p className="page-header-subtitle">
            I am always open to conversations about purposeful work, collaboration, and impactful opportunities.
          </p>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
