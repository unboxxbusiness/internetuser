import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/firebase/server';
import type { DecodedIdToken } from 'firebase-admin/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of all routes that should be publicly accessible
  const publicRoutes = ['/', '/auth/login', '/auth/signup'];

  // Exclude API routes, static files, and image optimization routes from auth checks
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session')?.value;

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
    const response = NextResponse.next();
    response.cookies.delete('session'); // Clear the invalid cookie
    return response;
  }

  const isAuthenticated = !!decodedToken;
  const userRole = decodedToken?.role;

  // If trying to access a public route while authenticated, redirect to the appropriate dashboard
  if (isPublicRoute && isAuthenticated) {
    const destination = userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // If trying to access a protected route without being authenticated, redirect to login
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If authenticated, handle role-based access control
  if (isAuthenticated) {
    // If a non-admin tries to access an admin route, redirect to user dashboard
    if (userRole !== 'admin' && isAdminRoute) {
        return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }
    // If an admin tries to access a user route, redirect to admin dashboard
    if (userRole === 'admin' && isUserRoute) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}
