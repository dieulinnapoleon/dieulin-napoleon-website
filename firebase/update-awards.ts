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

const OLD = 'CFA Research Challenge — Semifinalist / Finalist';
const NEW = 'CFA Institute Research Challenge — Colorado Finalist (2026)';

function fix(v: any): any {
  if (typeof v === 'string') return v.split(OLD).join(NEW);
  if (Array.isArray(v)) return v.map(fix);
  if (v && typeof v === 'object' && v.constructor === Object) {
    const o: any = {}; for (const k of Object.keys(v)) o[k] = fix(v[k]); return o;
  }
  return v;
}

async function main() {
  console.log(APPLY ? '=== APPLY MODE ===' : '=== DRY RUN (no changes) ===');
  const snap = await db.collection('cvSections').get();
  let found = 0;
  for (const doc of snap.docs) {
    const data = doc.data();
    const updates: any = {};
    for (const key of Object.keys(data)) {
      const fixed = fix(data[key]);
      if (JSON.stringify(fixed) !== JSON.stringify(data[key])) updates[key] = fixed;
    }
    if (Object.keys(updates).length) {
      found++;
      console.log(`cvSections/${doc.id} -> ${Object.keys(updates).join(', ')}`);
      if (APPLY) await doc.ref.update(updates);
    }
  }
  console.log(`\n${found} document(s) ${APPLY ? 'updated' : 'would be updated'}.`);
}

main().catch(console.error);
