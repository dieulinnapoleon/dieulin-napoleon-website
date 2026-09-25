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
const STAGES: [string, string][] = [
  ['Creasti', 'In Development'],
  ['LINEON', 'In Development'],
  ['FINANCEM', 'Concept'],
  ['PATRIYA', 'Concept'],
  ['ReSource', 'Feasibility Study Complete'],
  ['GACED', 'Completed (2016–2022)'],
];
const CREASTI_OLD = 'A gamified savings and financial wellness app designed';
const CREASTI_NEW = 'Creasti, Inc., a Delaware C corporation, is building a gamified savings and financial wellness app designed';

async function main() {
  console.log(APPLY ? '=== APPLY MODE ===' : '=== DRY RUN (no changes) ===');
  const snap = await db.collection('projects').get();
  for (const doc of snap.docs) {
    const d = doc.data();
    const title = String(d.title || '');
    const stage = STAGES.find(([kw]) => title.includes(kw));
    if (!stage) {
      console.log(`NO MATCH (unchanged): projects/${doc.id} "${title}"`);
      continue;
    }
    const updates: any = { status: stage[1], updated_at: new Date().toISOString() };
    if (stage[0] === 'Creasti' && typeof d.description === 'string' && d.description.includes(CREASTI_OLD)) {
      updates.description = d.description.replace(CREASTI_OLD, CREASTI_NEW);
    }
    console.log(`projects/${doc.id} "${title}": status "${d.status}" -> "${stage[1]}"${updates.description ? ' + Creasti, Inc. description' : ''}`);
    if (APPLY) await doc.ref.update(updates);
  }
}

main().catch(console.error);
