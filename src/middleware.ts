import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/app/auth/actions";

export async function middleware(request: NextRequest) {
  const user = await getUser();
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute = pathname.startsWith("/user");

  if (!user) {
    if (isAdminRoute || isUserRoute) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  const { role } = user;

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  if (isUserRoute && role !== "user") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  
  if(pathname.startsWith("/auth")) {
    const redirectTo = role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}