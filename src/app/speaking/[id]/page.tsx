import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mic, GraduationCap, Users, Trophy, Wrench, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEvents } from '@/lib/data';
import type { Metadata } from 'next';

export const revalidate = 60;

const ICONS: Record<string, any> = { speaking: Mic, panel: Users, lecture: GraduationCap, workshop: Wrench, competition: Trophy };

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const events = await getEvents();
  const event = events.find((e) => e.id === params.id);
  if (!event) return { title: 'Event Not Found' };
  return { title: event.title + ' | Speaking', description: event.description };
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const events = await getEvents();
  const event = events.find((e) => e.id === params.id);
  if (!event) notFound();

  const Icon = ICONS[event.type] || Mic;

  return (
    <>
      <section className="bg-navy pt-32 pb-16">
        <div className="section-container">
          <Link href="/speaking" className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-6 hover:text-gold-300 transition-colors">
            <ArrowLeft size={16} /> Back to Speaking & Events
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center"><Icon size={20} className="text-gold" /></div>
            <span className="text-xs bg-white/10 text-white/60 px-3 py-1 rounded-full capitalize">{event.type}</span>
          </div>
          <h1 className="font-display text-[clamp(28px,4vw,44px)] font-bold text-white mb-3">{event.title}</h1>
          <p className="text-lg text-gold font-medium mb-2">{event.event_name}</p>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {event.date}</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-container max-w-3xl">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed">{event.description}</p>
          </div>

          {event.url && (
            <div className="mt-8">
              <a href={event.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gold font-semibold hover:text-navy transition-colors">
                Learn more about this event <ArrowRight size={16} />
              </a>
            </div>
          )}

          <div className="mt-16 text-center p-12 rounded-2xl bg-navy">
            <h3 className="font-display text-2xl font-semibold text-white mb-3">Invite Me to Speak</h3>
            <p className="text-white/50 mb-6">Available for speaking engagements, guest lectures, panels, and workshops.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/contact"><Button className="bg-gold hover:bg-gold-300 text-white">Get in Touch <ArrowRight size={16} /></Button></Link>
              <Link href="/speaking"><Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-navy">All Events</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
