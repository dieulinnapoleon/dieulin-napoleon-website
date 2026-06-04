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
          html: '<div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;background:#ffffff;">' +
              '<div style="background:#0B1A2F;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">' +
                '<div style="display:inline-block;width:48px;height:48px;background:rgba(196,149,58,0.2);border-radius:12px;line-height:48px;color:#C4953A;font-weight:bold;font-size:20px;font-family:Georgia,serif;">DN</div>' +
                '<p style="color:#C4953A;font-size:11px;letter-spacing:2px;margin:12px 0 0;text-transform:uppercase;">Dieulin Napoleon</p>' +
                '<p style="color:rgba(255,255,255,0.4);font-size:12px;margin:4px 0 0;">Finance \u00b7 Impact \u00b7 Strategy</p>' +
              '</div>' +
              '<div style="padding:32px 24px;border:1px solid #f0f0f0;border-top:none;">' +
                '<h2 style="color:#0B1A2F;font-size:22px;margin:0 0 16px;font-family:Georgia,serif;">' + subject + '</h2>' +
                body.split('\n').map((p: string) => '<p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 12px;">' + p + '</p>').join('') +
              '</div>' +
              '<div style="background:#f9f9f9;padding:24px;text-align:center;border:1px solid #f0f0f0;border-top:none;border-radius:0 0 12px 12px;">' +
                '<p style="color:#999;font-size:12px;margin:0 0 8px;">Dieulin Napoleon &middot; Finance Professional &middot; Entrepreneur</p>' +
                '<a href="https://dieulinnapoleon.com" style="color:#C4953A;font-size:12px;text-decoration:none;">dieulinnapoleon.com</a>' +
                '<p style="color:#ccc;font-size:10px;margin:12px 0 0;">You received this because you subscribed to insights from Dieulin Napoleon.</p>' +
              '</div>' +
            '</div>',
        });
        sent++;
      } catch (err) {
        console.error('[Newsletter] Failed to send to', email, err);
      }
    }

    // Log the sent newsletter
    await db.collection('newslettersSent').add({
      subject,
      body,
      sent_to: sent,
      total: emails.length,
      sent_at: new Date().toISOString(),
      sent_by: decoded.email || decoded.uid,
    });

    return NextResponse.json({ success: true, sent, total: emails.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
