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

async function migrate() {
  console.log('=== Checking collections ===');

  const oldSnap = await db.collection('haiti2077Proposals').get();
  console.log('haiti2077Proposals:', oldSnap.size, 'docs');

  const newSnap = await db.collection('haiti2077Proposals').get();
  console.log('haiti2077Proposals:', newSnap.size, 'docs');

  if (oldSnap.empty) {
    console.log('No old data to migrate.');
    return;
  }

  if (!newSnap.empty) {
    console.log('New collection already has data. Skipping to avoid duplicates.');
    return;
  }

  console.log('\nMigrating ' + oldSnap.size + ' docs from haiti2077Proposals to haiti2077Proposals...');
  for (const doc of oldSnap.docs) {
    await db.collection('haiti2077Proposals').doc(doc.id).set(doc.data());
    console.log('  Copied: ' + doc.id + ' (' + doc.data().proposalTitle + ')');
  }
  console.log('\nMigration complete! ' + oldSnap.size + ' docs copied.');
  console.log('Old collection (haiti2077Proposals) preserved as backup.');
}

migrate().catch(console.error);
