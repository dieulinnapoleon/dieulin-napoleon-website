import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    const auth = getAdminAuth();
    const db = getAdminDb();

    // 1. Verify the Firebase ID token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (tokenErr: any) {
      console.error('Token verification failed:', tokenErr.code);
      return NextResponse.json(
        { error: 'Session expired. Please log in again.' },
        { status: 401 }
      );
    }

    // 2. Look up admin document in Firestore (case-sensitive: adminUsers)
    const adminDoc = await db.collection('adminUsers').doc(decodedToken.uid).get();

    if (!adminDoc.exists) {
      console.error(`Admin lookup failed: no document at adminUsers/${decodedToken.uid} for ${decodedToken.email}`);
      return NextResponse.json(
        { error: 'Admin profile not found in Firestore. Check that adminUsers/{uid} exists with the correct casing.' },
        { status: 403 }
      );
    }

    const adminData = adminDoc.data()!;

    // 3. Check active status
    if (adminData.active === false) {
      return NextResponse.json(
        { error: 'Admin account is inactive.' },
        { status: 403 }
      );
    }

    // 4. Check role
    const role = adminData.role;
    if (role !== 'admin' && role !== 'owner') {
      return NextResponse.json(
        { error: 'You are logged in but not authorized as admin.' },
        { status: 403 }
      );
    }

    // 5. Create a session cookie (5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true });
    response.cookies.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    console.log(`Admin login successful: ${decodedToken.email} (${decodedToken.uid})`);
    return response;
  } catch (err: any) {
    console.error('Login error:', err.message || err);
    return NextResponse.json(
      { error: err.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}
