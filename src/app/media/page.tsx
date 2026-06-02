import type { Metadata } from 'next';
import { ExternalLink, Award, Mic, Newspaper, Globe } from 'lucide-react';
import { getMediaItems } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Media',
  description: 'Awards, press, speaking engagements, platforms, and media appearances by Dieulin Napoleon.',
};

export const revalidate = 60;

const TYPE_ICONS: Record<string, any> = {
  award: Award,
  press: Newspaper,
  speaking: Mic,
  platform: Globe,
};

export default async function MediaPage() {
  const items = await getMediaItems();

  // Group by type
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const sections = [
    { type: 'award', title: 'Awards & Recognition' },
    { type: 'speaking', title: 'Speaking & Teaching' },
    { type: 'press', title: 'Press & Publications' },
    { type: 'platform', title: 'Platforms & Affiliations' },
  ].filter((s) => grouped[s.type]?.length > 0);

  return (
    <div>
      <section className="page-header">
        <div className="section-container">
          <p className="page-header-label">Portfolio</p>
          <h1 className="page-header-title">Media &amp; Links</h1>
          <p className="page-header-subtitle">
            Awards, affiliations, platforms, and media appearances.
          </p>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-4xl mx-auto">
          {sections.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Media items coming soon.</p>
            </div>
          ) : (
            sections.map((section) => {
              const Icon = TYPE_ICONS[section.type] || Globe;
              return (
                <div key={section.type} className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <h2 className="font-display text-xl font-semibold text-navy">{section.title}</h2>
                  </div>
                  <div className="space-y-3 ml-12">
                    {grouped[section.type].map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="font-medium text-navy text-sm">{item.title}</h3>
                          {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
                          {item.date && <p className="text-xs text-gray-400 mt-1">{item.date}</p>}
                        </div>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0">
                            <ExternalLink size={16} className="text-gold" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
