import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/lib/firebase-admin';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  organization: z.string().optional().default(''),
  reason: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const db = getAdminDb();
    await db.collection('contactMessages').add({
      name: data.name,
      email: data.email,
      organization: data.organization,
      reason: data.reason,
      message: data.message,
      read: false,
      created_at: new Date().toISOString(),
    });

    // Send notification email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Website Contact <onboarding@resend.dev>',
          to: process.env.CONTACT_NOTIFICATION_EMAIL || 'napoleondieulin@gmail.com',
          subject: 'New Contact: ' + (body.name || 'Website Visitor'),
          html: '<h3>New contact form submission</h3><p><strong>Name:</strong> ' + (body.name || '') + '</p><p><strong>Email:</strong> ' + (body.email || '') + '</p><p><strong>Reason:</strong> ' + (body.reason || '') + '</p><p><strong>Message:</strong></p><p>' + (body.message || '') + '</p>',
        });
      } catch (emailErr) {
        console.error('[Contact] Notification email failed:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    console.error('Contact submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
