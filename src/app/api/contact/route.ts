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

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    console.error('Contact submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
