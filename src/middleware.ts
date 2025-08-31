import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');

  if (!session) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    const isAdmin = decodedToken.admin === true;

    if (isAuthPage) {
      return NextResponse.redirect(new URL(isAdmin ? '/' : '/user', request.url));
    }
    
    // Redirect root access to the correct dashboard
    if (pathname === '/') {
      if (isAdmin) {
         return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/user', request.url));
      }
    }

    if (pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/user', request.url));
    }
    
    if ((pathname.startsWith('/customers') || pathname.startsWith('/plans')) && !isAdmin) {
        return NextResponse.redirect(new URL('/user', request.url));
    }

    if (pathname.startsWith('/user') && isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Clear the invalid cookie
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.set('session', '', { maxAge: -1 });
    return response;
  }
}

export const config = {
  matcher: ['/((?!api/auth/logout|_next/static|_next/image|favicon.ico).*)'],
};
