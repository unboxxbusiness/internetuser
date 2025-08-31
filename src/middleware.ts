import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/((?!api|_next/static|_next/image|favicon.ico|auth/login).*)'],
};

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;

  if (request.nextUrl.pathname.startsWith('/auth/login')) {
    if (sessionCookie) {
      try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const redirectPath = decodedClaims.admin ? '/admin' : '/user';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      } catch (error) {
        // Session cookie is invalid, let them proceed to login
      }
    }
    return NextResponse.next();
  }
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const isAdmin = decodedClaims.admin === true;
    const path = request.nextUrl.pathname;

    if (path.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/user', request.url));
    }

    if (path.startsWith('/user') && isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (path === '/') {
        const redirectPath = isAdmin ? '/admin' : '/user';
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}
