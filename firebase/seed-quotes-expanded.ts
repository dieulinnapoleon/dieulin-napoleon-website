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
  // ===== DISCIPLINE & HABITS =====
  { text: 'What you do when no one is watching is what defines you when everyone is.', category: 'Discipline', tags: ['discipline','integrity','character'] },
  { text: 'Consistency is louder than talent. Show up every day and the results will follow.', category: 'Discipline', tags: ['discipline','consistency','success'] },
  { text: 'The morning routine you build today is the empire you inherit tomorrow.', category: 'Discipline', tags: ['discipline','habits','morning'] },
  { text: 'Discipline is choosing between what you want now and what you want most.', category: 'Discipline', tags: ['discipline','sacrifice','goals'] },
  { text: 'Champions are not made in the arena. They are made in the hours nobody sees.', category: 'Discipline', tags: ['discipline','work','excellence'] },

  // ===== FAITH & SPIRITUALITY =====
  { text: 'When the path is unclear, let faith be your compass and gratitude your fuel.', category: 'Faith', tags: ['faith','gratitude','guidance'] },
  { text: 'God does not call the qualified. He qualifies the called.', category: 'Faith', tags: ['faith','purpose','calling'] },
  { text: 'Prayer is not a last resort. It is the first strategy.', category: 'Faith', tags: ['faith','prayer','strategy'] },
  { text: 'The seasons of waiting are often the seasons of greatest preparation.', category: 'Faith', tags: ['faith','patience','preparation'] },
  { text: 'Before you were a professional, a student, or a title, you were a purpose placed on this earth.', category: 'Faith', tags: ['faith','purpose','identity'] },

  // ===== LEADERSHIP =====
  { text: 'A leader who cannot serve has nothing worth leading toward.', category: 'Leadership', tags: ['leadership','service','humility'] },
  { text: 'Vision without execution is decoration. Execution without vision is exhaustion.', category: 'Leadership', tags: ['leadership','vision','execution'] },
  { text: 'The best leaders do not create followers. They create other leaders.', category: 'Leadership', tags: ['leadership','mentoring','empowerment'] },
  { text: 'Lead with questions before answers. The most powerful leaders are the most curious ones.', category: 'Leadership', tags: ['leadership','curiosity','learning'] },
  { text: 'Authority is given by a title. Influence is earned by character.', category: 'Leadership', tags: ['leadership','influence','character'] },

  // ===== ENTREPRENEURSHIP =====
  { text: 'Every unsolved problem is a business waiting to be born.', category: 'Entrepreneurship', tags: ['entrepreneurship','opportunity','innovation'] },
  { text: 'The market does not reward your effort. It rewards the value you deliver.', category: 'Entrepreneurship', tags: ['entrepreneurship','value','market'] },
  { text: 'Start before you are ready. Adjust while you are moving. Finish what you started.', category: 'Entrepreneurship', tags: ['entrepreneurship','action','persistence'] },
  { text: 'A business plan on paper is a dream. A business plan in motion is a venture.', category: 'Entrepreneurship', tags: ['entrepreneurship','action','planning'] },
  { text: 'Your first customer teaches you more than your first textbook ever will.', category: 'Entrepreneurship', tags: ['entrepreneurship','learning','customers'] },

  // ===== HAITI & PATRIOTISM =====
  { text: 'Haiti does not need saviors. It needs builders who refuse to leave the construction site.', category: 'Haiti', tags: ['haiti','patriotism','commitment'] },
  { text: 'The diaspora is not a departure. It is a bridge waiting to be crossed in both directions.', category: 'Haiti', tags: ['haiti','diaspora','connection'] },
  { text: 'Loving your country means building it, not just mourning what it has lost.', category: 'Haiti', tags: ['haiti','patriotism','action'] },
  { text: 'The Citadelle was not built by people who accepted that things could not change.', category: 'Haiti', tags: ['haiti','history','determination'] },
  { text: 'Every Haitian child who receives a quality education is a revolution in progress.', category: 'Haiti', tags: ['haiti','education','revolution'] },

  // ===== EDUCATION & KNOWLEDGE =====
  { text: 'Education is not what you memorize. It is what you become.', category: 'Education', tags: ['education','growth','transformation'] },
  { text: 'A degree opens doors. What you do once inside determines everything.', category: 'Education', tags: ['education','opportunity','effort'] },
  { text: 'The most dangerous form of poverty is the poverty of the mind.', category: 'Education', tags: ['education','mindset','poverty'] },
  { text: 'Read widely. Think critically. Speak carefully. Act decisively.', category: 'Education', tags: ['education','wisdom','action'] },
  { text: 'Your education is the one investment that no crisis can take from you.', category: 'Education', tags: ['education','investment','resilience'] },

  // ===== RESILIENCE =====
  { text: 'You are not defined by how many times you fell. You are defined by how many times you stood back up.', category: 'Resilience', tags: ['resilience','strength','perseverance'] },
  { text: 'Storms do not last forever. But the roots you grow during them do.', category: 'Resilience', tags: ['resilience','growth','adversity'] },
  { text: 'Pressure does not break you. It reveals what you are made of.', category: 'Resilience', tags: ['resilience','pressure','character'] },
  { text: 'The scar is not a sign of defeat. It is a receipt for a battle you survived.', category: 'Resilience', tags: ['resilience','survival','strength'] },
  { text: 'Endurance is not passive. It is the active decision to outlast what was meant to destroy you.', category: 'Resilience', tags: ['resilience','endurance','determination'] },

  // ===== FINANCE & WEALTH =====
  { text: 'Financial freedom is not about how much you earn. It is about how much you keep and how wisely you grow it.', category: 'Finance', tags: ['finance','wealth','discipline'] },
  { text: 'A budget is not a cage. It is a strategy for building the life you actually want.', category: 'Finance', tags: ['finance','budgeting','strategy'] },
  { text: 'Compound interest works for those who start early and against those who start late.', category: 'Finance', tags: ['finance','investing','time'] },
  { text: 'The best investment you will ever make is the one you make in yourself.', category: 'Finance', tags: ['finance','self-improvement','investment'] },
  { text: 'Wealth built on integrity outlasts wealth built on shortcuts.', category: 'Finance', tags: ['finance','integrity','wealth'] },

  // ===== FAMILY & RELATIONSHIPS =====
  { text: 'A strong family is not one without problems. It is one that faces problems together.', category: 'Family', tags: ['family','unity','strength'] },
  { text: 'The conversations you have at your dinner table shape the leaders of tomorrow.', category: 'Family', tags: ['family','education','leadership'] },
  { text: 'Love your children enough to discipline them. Love them enough to model what you expect.', category: 'Family', tags: ['family','parenting','discipline'] },
  { text: 'Behind every successful person is a family that believed in them before the world did.', category: 'Family', tags: ['family','support','belief'] },

  // ===== PURPOSE & CALLING =====
  { text: 'Your purpose is not something you find. It is something you build, one decision at a time.', category: 'Purpose', tags: ['purpose','decisions','building'] },
  { text: 'If your dream does not scare you a little, it is not big enough.', category: 'Purpose', tags: ['purpose','ambition','courage'] },
  { text: 'Legacy is not what you leave for people. It is what you leave in them.', category: 'Purpose', tags: ['purpose','legacy','impact'] },
  { text: 'Do not chase success. Chase significance. Success follows those who create meaning.', category: 'Purpose', tags: ['purpose','significance','meaning'] },

  // ===== SERVICE & IMPACT =====
  { text: 'The measure of a life well lived is not what you accumulated but what you contributed.', category: 'Service', tags: ['service','impact','legacy'] },
  { text: 'Impact is not about doing something big once. It is about doing something meaningful consistently.', category: 'Service', tags: ['service','consistency','impact'] },
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
}

async function main() {
  const existing = await db.collection('quotes').get();
  const existingSlugs = new Set(existing.docs.map(doc => doc.data().slug));
  let added = 0;
  const startOrder = existing.size;

  for (let i = 0; i < QUOTES.length; i++) {
    const q = QUOTES[i];
    const slug = slugify(q.text);
    if (existingSlugs.has(slug)) {
      continue;
    }
    await db.collection('quotes').add({
      text: q.text,
      author: 'Dieulin Napoleon',
      source: 'Original',
      category: q.category,
      tags: q.tags,
      slug,
      language: 'en',
      published: true,
      featured: false,
      scheduledDate: '',
      sortOrder: startOrder + i,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    added++;
  }
  console.log('Added ' + added + ' new quotes (skipped ' + (QUOTES.length - added) + ' duplicates)');
  console.log('Total quotes now: ' + (existing.size + added));
}

main().catch(console.error);
