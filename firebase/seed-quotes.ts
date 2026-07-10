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

const QUOTES = [
  { text: 'Small disciplines repeated daily become the architecture of a meaningful life.', author: 'Dieulin Napoleon', source: 'Original', category: 'Discipline', tags: ['discipline','growth','motivation'], slug: 'small-disciplines-repeated-daily', language: 'en', published: true, featured: true, sortOrder: 0 },
  { text: 'A country is transformed first in the imagination of those who refuse to give up on it.', author: 'Dieulin Napoleon', source: 'Original', category: 'Patriotism', tags: ['haiti','patriotism','hope'], slug: 'country-transformed-imagination', language: 'en', published: true, featured: false, sortOrder: 1 },
  { text: 'Progress begins when responsibility becomes personal.', author: 'Dieulin Napoleon', source: 'Original', category: 'Leadership', tags: ['leadership','responsibility','growth'], slug: 'progress-begins-responsibility-personal', language: 'en', published: true, featured: false, sortOrder: 2 },
  { text: 'Your future is not only built by what you dream, but by what you repeat.', author: 'Dieulin Napoleon', source: 'Original', category: 'Discipline', tags: ['discipline','future','habits'], slug: 'future-built-by-what-you-repeat', language: 'en', published: true, featured: false, sortOrder: 3 },
  { text: 'Leadership is the courage to serve beyond personal comfort.', author: 'Dieulin Napoleon', source: 'Original', category: 'Leadership', tags: ['leadership','service','courage'], slug: 'leadership-courage-serve', language: 'en', published: true, featured: false, sortOrder: 4 },
  { text: 'The wall between intention and action is a cardboard wall. Push through it.', author: 'Dieulin Napoleon', source: 'Original', category: 'Motivation', tags: ['motivation','action','mindset'], slug: 'wall-intention-action-cardboard', language: 'en', published: true, featured: false, sortOrder: 5 },
  { text: 'Knowledge does not have a color, a race, or a gender. It belongs to those who pursue it.', author: 'Dieulin Napoleon', source: 'Original', category: 'Education', tags: ['education','equity','knowledge'], slug: 'knowledge-no-color-race-gender', language: 'en', published: true, featured: false, sortOrder: 6 },
  { text: 'Put God first, and every formula in your life will produce the right answer.', author: 'Dieulin Napoleon', source: 'Original', category: 'Faith', tags: ['faith','purpose','spirituality'], slug: 'put-god-first-formula', language: 'en', published: true, featured: false, sortOrder: 7 },
  { text: 'An entrepreneur does not wait for the perfect conditions. They build with what they have.', author: 'Dieulin Napoleon', source: 'Original', category: 'Entrepreneurship', tags: ['entrepreneurship','action','resourcefulness'], slug: 'entrepreneur-build-with-what-they-have', language: 'en', published: true, featured: false, sortOrder: 8 },
  { text: 'Resilience is not the absence of hardship. It is the refusal to be defined by it.', author: 'Dieulin Napoleon', source: 'Original', category: 'Resilience', tags: ['resilience','strength','mindset'], slug: 'resilience-refusal-defined-by-hardship', language: 'en', published: true, featured: false, sortOrder: 9 },
  { text: 'The family that builds together inherits more than wealth. It inherits purpose.', author: 'Dieulin Napoleon', source: 'Original', category: 'Family', tags: ['family','purpose','legacy'], slug: 'family-builds-together-inherits-purpose', language: 'en', published: true, featured: false, sortOrder: 10 },
  { text: 'True service asks nothing in return except the privilege of having made a difference.', author: 'Dieulin Napoleon', source: 'Original', category: 'Service', tags: ['service','humility','impact'], slug: 'true-service-asks-nothing', language: 'en', published: true, featured: false, sortOrder: 11 },
  { text: 'Hope is not passive. Hope is the decision to act when evidence is against you.', author: 'Dieulin Napoleon', source: 'Original', category: 'Hope', tags: ['hope','faith','action'], slug: 'hope-decision-to-act', language: 'en', published: true, featured: false, sortOrder: 12 },
  { text: 'Wisdom is knowing when to speak, when to listen, and when to walk away and build.', author: 'Dieulin Napoleon', source: 'Original', category: 'Wisdom', tags: ['wisdom','patience','growth'], slug: 'wisdom-speak-listen-build', language: 'en', published: true, featured: false, sortOrder: 13 },
  { text: 'Growth does not come from what is easy. It comes from what you refuse to quit.', author: 'Dieulin Napoleon', source: 'Original', category: 'Growth', tags: ['growth','perseverance','discipline'], slug: 'growth-refuse-to-quit', language: 'en', published: true, featured: false, sortOrder: 14 },
];

async function main() {
  const existing = await db.collection('quotes').limit(1).get();
  if (!existing.empty) {
    console.log('Quotes already seeded (' + (await db.collection('quotes').get()).size + ' docs)');
    return;
  }
  for (const q of QUOTES) {
    await db.collection('quotes').add({ ...q, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  console.log('Seeded ' + QUOTES.length + ' quotes');
}

main().catch(console.error);
