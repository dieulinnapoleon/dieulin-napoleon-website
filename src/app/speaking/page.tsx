import Link from 'next/link';
import { ArrowRight, Mic, GraduationCap, Users, Trophy, Wrench, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEvents } from '@/lib/data';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Speaking & Events',
  description: 'Speaking engagements, lectures, panels, and competitions by Dieulin Napoleon.',
};

const ICONS: Record<string, any> = { speaking: Mic, panel: Users, lecture: GraduationCap, workshop: Wrench, competition: Trophy };

export default async function SpeakingPage() {
  const events = await getEvents();

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: events.map((event, i) => ({
      '@type': 'Event',
      position: i + 1,
      name: event.title,
      description: event.description,
      location: { '@type': 'Place', name: event.location },
      organizer: { '@type': 'Person', name: 'Dieulin Napoleon' },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <section className="bg-navy pt-32 pb-16">
        <div className="section-container text-center">
          <p className="page-header-label">Engagements</p>
          <h1 className="font-display text-[clamp(32px,5vw,48px)] font-bold text-white mb-4">Speaking & Events</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Lectures, competitions, panels, and presentations on finance, entrepreneurship, sustainability, and impact.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="section-container max-w-4xl">
          <div className="space-y-6">
            {events.map((event) => {
              const Icon = ICONS[event.type] || Mic;
              return (
                <div key={event.id} className="flex gap-6 p-6 rounded-2xl border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0"><Icon size={22} className="text-gold" /></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-navy">{event.title}</h3>
                        <p className="text-sm text-gold font-medium">{event.event_name}</p>
                      </div>
                      <span className="text-xs bg-navy/5 text-navy px-3 py-1 rounded-full shrink-0 capitalize">{event.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                    </div>
                    <Link href={"/speaking/" + event.id} className="inline-flex items-center gap-1 text-gold text-xs font-semibold hover:text-navy transition-colors">View Details</Link>
                    {event.url && (<a href={event.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-gold text-xs font-semibold hover:text-navy transition-colors">Learn more</a>)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-16 text-center p-12 rounded-2xl bg-navy">
            <h3 className="font-display text-2xl font-semibold text-white mb-3">Invite Me to Speak</h3>
            <p className="text-white/50 mb-6">Available for speaking engagements, guest lectures, panels, and workshops on finance, entrepreneurship, sustainability, and Haiti-focused innovation.</p>
            <Link href="/contact"><Button className="bg-gold hover:bg-gold-300 text-white">Get in Touch <ArrowRight size={16} /></Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
