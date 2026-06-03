import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  // Verify admin session
  const session = request.cookies.get('__session')?.value;
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifySessionCookie(session, true);
    const db = getAdminDb();
    const adminDoc = await db.collection('adminUsers').doc(decoded.uid).get();
    if (!adminDoc.exists) return NextResponse.json({ error: 'Not admin' }, { status: 403 });

    const { subject, body } = await request.json();
    if (!subject || !body) return NextResponse.json({ error: 'Subject and body required' }, { status: 400 });

    // Get all subscribers
    const snap = await db.collection('newsletterSubscribers').get();
    const emails = snap.docs.map(doc => doc.data().email).filter(Boolean);

    if (emails.length === 0) return NextResponse.json({ error: 'No subscribers' }, { status: 400 });

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email not configured. Add RESEND_API_KEY to environment variables.' }, { status: 500 });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    let sent = 0;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Dieulin Napoleon <onboarding@resend.dev>';

    // Send to each subscriber (Resend free tier: 100/day)
    for (const email of emails) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: subject,
          html: '<div style="max-width:600px;margin:0 auto;font-family:sans-serif;"><h2>' + subject + '</h2>' + body.split('\n').map((p: string) => '<p>' + p + '</p>').join('') + '<hr style="margin:24px 0;border:none;border-top:1px solid #eee;"><p style="color:#999;font-size:12px;">Dieulin Napoleon &middot; <a href="https://dieulinnapoleon.com">dieulinnapoleon.com</a></p></div>',
        });
        sent++;
      } catch (err) {
        console.error('[Newsletter] Failed to send to', email, err);
      }
    }

    return NextResponse.json({ success: true, sent, total: emails.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
