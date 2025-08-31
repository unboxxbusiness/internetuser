import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/firebase/server";
import type { DecodedIdToken } from "firebase-admin/auth";

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const decodedToken: DecodedIdToken = await auth.verifySessionCookie(
      sessionCookie,
      true
    );
    const userRole = decodedToken.role || 'user';

    if (pathname.startsWith("/admin") && userRole !== "admin") {
       // If a non-admin tries to access an admin route, send them to their correct dashboard
       return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }

    if (pathname.startsWith("/user") && userRole === "admin") {
      // If an admin accidentally lands on a user route, redirect them to the admin dashboard
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();

  } catch (error) {
    // Session cookie is invalid or expired.
    // Clear the cookie and redirect to login.
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("session");
    return response;
  }
}
