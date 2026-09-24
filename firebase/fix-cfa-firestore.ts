import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

function getServiceAccount(): any {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }
  const fs = require('fs');
  return JSON.parse(fs.readFileSync(resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string), 'utf8'));
}

if (getApps().length === 0) initializeApp({ credential: cert(getServiceAccount()) });
const db = getFirestore();

const APPLY = process.argv.includes('--apply');
const SKIP = ['newsletterSubscribers', 'contactMessages', 'haiti2075Proposals', 'haiti2077Proposals', 'newslettersSent'];
const PAIRS: [string, string][] = [
  ['CFA Level I Candidate', 'Passed CFA Level I Exam'],
  ['CFA Level 1 Candidate', 'Passed CFA Level I Exam'],
  ['CFA Program Candidate', 'Passed CFA Level I Exam'],
  ['Summer 2026 opportunities', 'Opportunities'],
];

function fix(v: any): any {
  if (typeof v === 'string') { let s = v; for (const [a, b] of PAIRS) s = s.split(a).join(b); return s; }
  if (Array.isArray(v)) return v.map(fix);
  if (v && typeof v === 'object' && v.constructor === Object) {
    const o: any = {}; for (const k of Object.keys(v)) o[k] = fix(v[k]); return o;
  }
  return v;
}

async function main() {
  console.log(APPLY ? '=== APPLY MODE ===' : '=== DRY RUN (no changes) ===');
  const cols = await db.listCollections();
  let found = 0;
  for (const col of cols) {
    if (SKIP.includes(col.id)) continue;
    const snap = await col.get();
    for (const doc of snap.docs) {
      const data = doc.data();
      const updates: any = {};
      for (const key of Object.keys(data)) {
        const fixed = fix(data[key]);
        if (JSON.stringify(fixed) !== JSON.stringify(data[key])) updates[key] = fixed;
      }
      const leftover = JSON.stringify(data).match(/.{0,40}(Candidate|Summer 2026|Completing).{0,20}/g);
      if (Object.keys(updates).length) {
        found++;
        console.log(`${col.id}/${doc.id} -> fields: ${Object.keys(updates).join(', ')}`);
        if (APPLY) await doc.ref.update(updates);
      } else if (leftover) {
        console.log(`CHECK MANUALLY ${col.id}/${doc.id}: ${leftover.join(' | ')}`);
      }
    }
  }
  console.log(`\n${found} document(s) ${APPLY ? 'updated' : 'would be updated'}.`);
}

main().catch(console.error);
