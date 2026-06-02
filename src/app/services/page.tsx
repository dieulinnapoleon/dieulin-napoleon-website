import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, FileText, Rocket, ClipboardList, Leaf, Globe2 } from 'lucide-react';
import { getServices } from '@/lib/data';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Professional services offered by Dieulin Napoleon — financial analysis, business planning, startup strategy, project management, ESG consulting, and Haiti market advisory.',
};

export const revalidate = 3600;

const ICON_MAP: Record<string, any> = {
  'bar-chart': BarChart3,
  'file-text': FileText,
  'rocket': Rocket,
  'clipboard': ClipboardList,
  'leaf': Leaf,
  'globe': Globe2,
};

const DEFAULT_ICONS = [BarChart3, FileText, Rocket, ClipboardList, Leaf, Globe2];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div>
      <section className="page-header">
        <div className="section-container">
          <p className="page-header-label">Expertise</p>
          <h1 className="page-header-title">Services</h1>
          <p className="page-header-subtitle">
            Professional consulting, advisory, and strategy services available for engagement.
          </p>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const Icon = ICON_MAP[service.icon] || DEFAULT_ICONS[idx % DEFAULT_ICONS.length];
              return (
                <div key={service.id} className="card p-7 group">
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mb-5 group-hover:bg-gold transition-colors">
                    <Icon size={22} className="text-gold group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-navy mb-3">{service.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{service.description}</p>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <ServiceDetail label="For Whom" value={service.for_whom} />
                    <ServiceDetail label="Deliverables" value={service.deliverables} />
                    <ServiceDetail label="Outcomes" value={service.outcomes} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center bg-gray-50 rounded-2xl p-12">
            <h2 className="font-display text-2xl font-bold text-navy mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-8">
              Every engagement begins with a conversation. Reach out to discuss your needs and
              explore how I can add value to your project or organization.
            </p>
            <Link href="/contact">
              <Button size="lg">Get in Touch <ArrowRight size={18} /></Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceDetail({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
      <p className="text-xs text-gray-600 leading-relaxed">{value}</p>
    </div>
  );
}
