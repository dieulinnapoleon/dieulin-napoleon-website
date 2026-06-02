/**
 * Firebase Admin User Setup Script
 *
 * Creates or updates the adminUsers/{uid} document in Firestore
 * with the correct collection name casing.
 *
 * Usage:
 *   npx tsx firebase/setup-admin.ts
 *
 * Requires FIREBASE_PRIVATE_KEY or FIREBASE_SERVICE_ACCOUNT_KEY in .env.local
 *
 * This script will:
 * 1. Look up the Firebase Auth user by email
 * 2. Create adminUsers/{uid} with the correct casing
 * 3. Optionally delete the old adminusers/{uid} document if it exists
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

// ─── Admin email to authorize ───
const ADMIN_EMAIL = 'napoleondieulin@gmail.com';

// ─── Firebase Admin Init ───
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
  throw new Error('Set FIREBASE_PRIVATE_KEY or FIREBASE_SERVICE_ACCOUNT_KEY in .env.local');
}

if (getApps().length === 0) {
  initializeApp({ credential: cert(getServiceAccount()) });
}

const db = getFirestore();
const auth = getAuth();

async function setupAdmin() {
  console.log('🔑 Setting up admin user...\n');

  // 1. Look up the Firebase Auth user
  let user;
  try {
    user = await auth.getUserByEmail(ADMIN_EMAIL);
    console.log(`  ✅ Found Firebase Auth user:`);
    console.log(`     Email: ${user.email}`);
    console.log(`     UID:   ${user.uid}`);
  } catch (err: any) {
    console.error(`  ❌ No Firebase Auth user found for ${ADMIN_EMAIL}`);
    console.error(`     Create one in Firebase Console → Authentication → Add User`);
    process.exit(1);
  }

  // 2. Create the correct adminUsers/{uid} document
  const correctPath = `adminUsers/${user.uid}`;
  console.log(`\n  📝 Creating ${correctPath}...`);

  await db.collection('adminUsers').doc(user.uid).set({
    email: user.email,
    role: 'admin',
    active: true,
    createdAt: FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`  ✅ ${correctPath} created successfully`);

  // 3. Check for and clean up the old lowercase collection
  const oldDoc = await db.collection('adminusers').doc(user.uid).get();
  if (oldDoc.exists) {
    console.log(`\n  🧹 Found old document at adminusers/${user.uid} — deleting...`);
    await db.collection('adminusers').doc(user.uid).delete();
    console.log(`  ✅ Old adminusers/${user.uid} deleted`);
  }

  // Also check if there are any docs in the old collection with different IDs
  const oldCollection = await db.collection('adminusers').limit(10).get();
  if (!oldCollection.empty) {
    console.log(`\n  ⚠️  Found ${oldCollection.size} remaining document(s) in old 'adminusers' collection:`);
    for (const doc of oldCollection.docs) {
      console.log(`     - adminusers/${doc.id} (email: ${doc.data().email || 'unknown'})`);
    }
    console.log(`     You may want to delete these manually in Firebase Console.`);
  }

  // 4. Verify
  const verifyDoc = await db.collection('adminUsers').doc(user.uid).get();
  if (verifyDoc.exists) {
    console.log(`\n  ✅ Verification passed: adminUsers/${user.uid} exists`);
    console.log(`     Data:`, JSON.stringify(verifyDoc.data(), null, 2));
  }

  console.log('\n✨ Admin setup complete! You can now log in at /admin/login\n');
}

setupAdmin().catch(console.error);
