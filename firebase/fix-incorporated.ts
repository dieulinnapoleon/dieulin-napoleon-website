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

async function fixIncorporated() {
  const snap = await db.collection('haiti2077Proposals').where('status', '==', 'incorporated').get();
  if (snap.empty) {
    console.log('No proposals with status "incorporated" found.');
    return;
  }
  for (const doc of snap.docs) {
    await doc.ref.update({ status: 'approved', incorporatedIntoPlan: true, updated_at: new Date().toISOString() });
    console.log('Fixed: ' + doc.id + ' -> status=approved, incorporatedIntoPlan=true');
  }
  console.log('Fixed ' + snap.size + ' proposals');
}

fixIncorporated().catch(console.error);
