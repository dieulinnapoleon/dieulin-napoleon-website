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

async function diagnose() {
  console.log('=== All proposals in haiti2077Proposals ===');
  const all = await db.collection('haiti2077Proposals').get();
  console.log('Total docs:', all.size);
  all.docs.forEach(doc => {
    const d = doc.data();
    console.log('  ID:', doc.id, '| status:', d.status, '| featured:', d.featured, '| incorporated:', d.incorporatedIntoPlan, '| title:', d.proposalTitle, '| created_at:', d.created_at);
  });

  console.log('\n=== Query: status == approved ===');
  try {
    const approved = await db.collection('haiti2077Proposals').where('status', '==', 'approved').get();
    console.log('Approved count:', approved.size);
  } catch (err: any) {
    console.log('ERROR querying approved:', err.message);
  }

  console.log('\n=== Query: status == approved + orderBy created_at desc ===');
  try {
    const ordered = await db.collection('haiti2077Proposals').where('status', '==', 'approved').orderBy('created_at', 'desc').get();
    console.log('Ordered count:', ordered.size);
  } catch (err: any) {
    console.log('ERROR with ordered query:', err.message);
  }
}

diagnose().catch(console.error);
