import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Protect /admin routes (except /admin/login)
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    // Check for Firebase auth session cookie
    const session = request.cookies.get('__session')?.value;

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Full token verification happens server-side in API routes / layout
    // The middleware only checks for cookie presence as a fast gate
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
