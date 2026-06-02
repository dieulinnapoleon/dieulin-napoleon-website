import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidation-secret');

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const paths = body.paths as string[] | undefined;

    if (paths && Array.isArray(paths)) {
      paths.forEach((path) => revalidatePath(path));
    } else {
      // Revalidate everything
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({ revalidated: true, paths: paths || ['all'] });
  } catch {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
