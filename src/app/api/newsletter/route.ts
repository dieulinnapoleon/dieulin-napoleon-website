import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/lib/firebase-admin';

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const db = getAdminDb();

    // Save to Firestore
    await db.collection('newsletterSubscribers').add({
      email: data.email,
      subscribed_at: new Date().toISOString(),
    });

    // Send welcome email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Dieulin Napoleon <onboarding@resend.dev>',
          to: data.email,
          subject: 'Welcome — Dieulin Napoleon Insights',
          html: '<h2>Thank you for subscribing!</h2><p>You will receive updates when I publish new insights on finance, entrepreneurship, and impact.</p><p>— Dieulin Napoleon</p><p><a href="https://dieulinnapoleon.com">dieulinnapoleon.com</a></p>',
        });
      } catch (emailErr) {
        console.error('[Newsletter] Welcome email failed:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
