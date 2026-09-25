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
const CONTENT: any[] = JSON.parse(readFileSync('/tmp/services_content.json', 'utf8'));

async function main() {
  console.log(APPLY ? '=== APPLY MODE ===' : '=== DRY RUN (no changes) ===');
  const snap = await db.collection('services').get();
  const used = new Set<string>();
  for (const doc of snap.docs) {
    const d = doc.data();
    const match = CONTENT.find((s) => !used.has(s.match) && String(d.title || '').includes(s.match));
    if (!match) {
      console.log(`NO MATCH (left unchanged): services/${doc.id} "${d.title}"`);
      continue;
    }
    used.add(match.match);
    console.log(`services/${doc.id}: "${d.title}" -> "${match.title}"`);
    if (APPLY) {
      await doc.ref.update({
        title: match.title,
        description: match.description,
        for_whom: match.for_whom,
        deliverables: match.deliverables,
        outcomes: match.outcomes,
        updated_at: new Date().toISOString(),
      });
    }
  }
  console.log(`\n${used.size} of ${snap.size} service(s) ${APPLY ? 'updated' : 'would be updated'}.`);
}

main().catch(console.error);
