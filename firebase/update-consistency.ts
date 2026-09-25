import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

function getServiceAccount(): any {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }
  return JSON.parse(readFileSync(resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string), 'utf8'));
}

if (getApps().length === 0) initializeApp({ credential: cert(getServiceAccount()) });
const db = getFirestore();
const APPLY = process.argv.includes('--apply');

const NEW_SUMMARY =
  'Finance professional building a path in investment research and valuation; currently an Investment Research Intern at NZS Capital. ' +
  'Master of Finance and Master of Business Administration (Impact MBA), Colorado State University; passed the CFA Level I Exam (August 2026). ' +
  'Background in public-sector leadership in Haiti, university teaching, and venture building focused on financial inclusion.';

async function main() {
  console.log(APPLY ? '=== APPLY MODE ===' : '=== DRY RUN (no changes) ===');

  const meta = db.collection('cvSections').doc('meta');
  const m = await meta.get();
  if (m.exists) {
    console.log('\nCURRENT CV SUMMARY:\n' + m.data()?.summary + '\n');
    console.log('NEW CV SUMMARY:\n' + NEW_SUMMARY + '\n');
    if (APPLY) await meta.update({ summary: NEW_SUMMARY });
  } else {
    console.log('cvSections/meta not found');
  }

  const snap = await db.collection('projects').get();
  for (const doc of snap.docs) {
    const d = doc.data();
    if (String(d.title || '').includes('GACED')) {
      console.log(`projects/${doc.id} "${d.title}": status "${d.status}" -> "Completed (2018–2022)"`);
      if (APPLY) await doc.ref.update({ status: 'Completed (2018–2022)', updated_at: new Date().toISOString() });
    }
  }
}

main().catch(console.error);
