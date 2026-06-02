import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('__session')?.value;

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifySessionCookie(session, true);

    return NextResponse.json({
      authenticated: true,
      uid: decoded.uid,
      email: decoded.email,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
