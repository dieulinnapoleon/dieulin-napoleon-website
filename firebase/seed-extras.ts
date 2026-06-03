import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

function getServiceAccount() {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const fs = require('fs');
    return JSON.parse(fs.readFileSync(resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_KEY), 'utf8'));
  }
  throw new Error('Set FIREBASE_PRIVATE_KEY or FIREBASE_SERVICE_ACCOUNT_KEY');
}

if (getApps().length === 0) initializeApp({ credential: cert(getServiceAccount()) });
const db = getFirestore();

const TESTIMONIALS = [
  { name: 'Faculty Advisor', title: 'Professor of Finance', organization: 'Colorado State University', quote: 'Dieulin brings exceptional analytical rigor and genuine passion for impact to everything he does. His ability to bridge finance theory with real-world entrepreneurial action sets him apart.', sort_order: 0, published: true },
  { name: 'Sustainability Director', title: 'Corporate Sustainability Lead', organization: 'Pegasus Logistics Group', quote: 'His work on our greenhouse gas inventory and decarbonization roadmap was thorough, data-driven, and delivered ahead of schedule. A rare combination of technical skill and strategic thinking.', sort_order: 1, published: true },
  { name: 'Entrepreneurship Mentor', title: 'Institute for Entrepreneurship', organization: 'Colorado State University', quote: 'Creasti earned its Impact Award because Dieulin does not just build products \u2014 he builds solutions rooted in deep understanding of the communities he serves.', sort_order: 2, published: true },
];

const BOOKS = [
  { title: 'Cardboard Walls: Building the Mindset to Succeed from Anywhere', theme: 'Mindset & Personal Development', status: 'In Progress', description: 'If you can build a positive mindset and dream big, there is nothing that can prevent you from succeeding \u2014 no matter where you come from. This book explores how the barriers we face are rarely as solid as they appear, and why the sooner you build a mindset of possibility, the sooner everything changes. Drawing from personal experience growing up in Haiti to earning graduate degrees in the United States, this is a practical guide to breaking through the cardboard walls that hold us back.', topics: ['Positive mindset', 'Dreaming beyond circumstances', 'Resilience', 'From Haiti to the world', 'Turning obstacles into staircases'], sort_order: 0, published: true },
  { title: 'Beyond Barriers: Why Knowledge Has No Color, Race, or Gender', theme: 'Leadership & Equity', status: 'Coming Soon', description: 'Knowledge does not have a color, a race, or a sex \u2014 but society seems to make it easier for some people to access it. This book challenges the categorical barriers that limit human potential and argues that everyone can accomplish everything when they refuse to accept artificial limitations.', topics: ['Universal access to knowledge', 'Breaking categorical barriers', 'Equity in education', 'Talent has no borders', 'Systemic change through individual action'], sort_order: 1, published: true },
  { title: 'Put God First: The Formula That Always Works', theme: 'Faith & Purpose', status: 'Coming Soon', description: 'In a world obsessed with strategies, frameworks, and formulas for success, this book offers the simplest and most powerful one: put God first. Drawing on faith, personal testimony, and the intersection of spiritual discipline with professional ambition, this book explores how prioritizing purpose over profit creates a foundation that never fails.', topics: ['Faith-driven leadership', 'Purpose before profit', 'Spiritual discipline', 'The intersection of faith and ambition', 'Building on an unshakable foundation'], sort_order: 2, published: true },
];

const EVENTS = [
  { title: 'Creasti: Gamifying Financial Inclusion', event_name: 'CSU Institute for Entrepreneurship Demo Day', location: 'Colorado State University, Fort Collins, CO', date: '2025', description: 'Pitched Creasti to a panel of investors, entrepreneurs, and faculty. Awarded the Impact Award for social innovation.', type: 'competition', sort_order: 0, published: true },
  { title: 'Ethics in Contemporary Organizations', event_name: 'BUS220 \u2014 Graduate Teaching Assistant', location: 'Colorado State University', date: '2024-2025', description: 'Facilitated discussions on business ethics, corporate responsibility, and stakeholder management for undergraduate students.', type: 'lecture', sort_order: 1, published: true },
  { title: 'Financial Accounting & Management', event_name: 'University Lecturer \u2014 4 Institutions', location: 'Haiti', date: '2015-2022', description: 'Taught undergraduate and graduate courses in financial accounting, management, organizational behavior, and financial mathematics across ISTEAH, UEH, UNDH, and UPNCH.', type: 'lecture', sort_order: 2, published: true },
  { title: 'National Ethics Case Competition', event_name: 'National Ethics Case Competition', location: 'United States', date: '2025', description: 'Semifinalist in the national ethics case competition, analyzing complex business ethics scenarios.', type: 'competition', sort_order: 3, published: true },
];

async function seedCollection(name: string, items: any[]) {
  const existing = await db.collection(name).limit(1).get();
  if (!existing.empty) {
    console.log('  ' + name + ': already has data (' + (await db.collection(name).get()).size + ' docs), skipping');
    return;
  }
  for (const item of items) {
    await db.collection(name).add({ ...item, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  console.log('  ' + name + ': seeded ' + items.length + ' documents');
}

async function main() {
  console.log('Seeding missing collections...\n');
  await seedCollection('testimonials', TESTIMONIALS);
  await seedCollection('books', BOOKS);
  await seedCollection('events', EVENTS);
  console.log('\nDone!');
}

main().catch(console.error);
