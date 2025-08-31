import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/firebase/server';
import type { DecodedIdToken } from 'firebase-admin/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  const publicRoutes = ['/auth/login', '/auth/signup', '/'];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/user');

  let decodedToken: DecodedIdToken | null = null;
  
  try {
    if (sessionCookie) {
      decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    }
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    // Invalid cookie, treat as unauthenticated
  }

  const isAuthenticated = !!decodedToken;
  const userRole = decodedToken?.role;

  // If trying to access a public route while authenticated, redirect to dashboard
  if (isPublicRoute && isAuthenticated) {
    const destination = userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // If trying to access a protected route without being authenticated, redirect to login
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If authenticated, handle role-based access
  if (isAuthenticated) {
    // If an admin tries to access a user route, or a user tries to access an admin route, redirect them
    if (userRole === 'admin' && isUserRoute) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if (userRole !== 'admin' && isAdminRoute) {
        return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Match all routes except for static files and the API route
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
