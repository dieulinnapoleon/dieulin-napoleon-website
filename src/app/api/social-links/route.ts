import { NextResponse } from 'next/server';
import { getSocialLinks } from '@/lib/data';

export const revalidate = 3600;

export async function GET() {
  const links = await getSocialLinks();
  return NextResponse.json({ links });
}
