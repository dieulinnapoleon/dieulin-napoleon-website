import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getStorage, type Storage } from 'firebase-admin/storage';

let adminApp: App;
let adminDb: Firestore;
let adminAuth: Auth;
let adminStorage: Storage;

function getServiceAccount() {
  // Option A: individual env vars (preferred for Vercel)
  if (process.env.FIREBASE_PRIVATE_KEY) {
    // Normalize the private key — handles both escaped \n and real newlines
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    // If the key contains literal \n (escaped), replace them with real newlines
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    // If the key is wrapped in extra quotes, strip them
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1).replace(/\\n/g, '\n');
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId || !clientEmail) {
      throw new Error(
        'Firebase Admin: FIREBASE_PROJECT_ID and FIREBASE_CLIENT_EMAIL are required alongside FIREBASE_PRIVATE_KEY'
      );
    }

    return { projectId, clientEmail, privateKey };
  }

  // Option B: service account JSON file (local dev)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const fs = require('fs');
      const path = require('path');
      const keyPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      return JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    } catch (err: any) {
      throw new Error(`Firebase Admin: Failed to read service account file: ${err.message}`);
    }
  }

  throw new Error(
    'Firebase Admin: Set FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL + FIREBASE_PROJECT_ID env vars, ' +
    'or set FIREBASE_SERVICE_ACCOUNT_KEY to a service account JSON path.'
  );
}

export function getAdminApp(): App {
  if (!adminApp) {
    if (getApps().length === 0) {
      try {
        adminApp = initializeApp({
          credential: cert(getServiceAccount()),
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
        console.log('[Firebase Admin] Initialized successfully');
      } catch (err: any) {
        console.error('[Firebase Admin] Initialization failed:', err.message);
        throw err;
      }
    } else {
      adminApp = getApps()[0];
    }
  }
  return adminApp;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}

export function getAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getAdminApp());
  }
  return adminAuth;
}

export function getAdminStorage(): Storage {
  if (!adminStorage) {
    adminStorage = getStorage(getAdminApp());
  }
  return adminStorage;
}
