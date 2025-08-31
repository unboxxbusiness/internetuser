import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase/server";
import type { DecodedIdToken } from "firebase-admin/auth";

// Exchange a Firebase ID token for a session cookie.
export async function POST(request: Request) {
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!idToken) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    // 5 days expiry
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const decodedToken: DecodedIdToken = await auth.verifyIdToken(idToken);
    const userRole = decodedToken.role || 'user'; // Default to 'user' if no role claim

    cookies().set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return NextResponse.json({ status: "success", role: userRole });
  } catch (error) {
    console.error("Session login error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 401 });
  }
}

// Clear the session cookie.
export async function DELETE() {
  try {
    cookies().delete("session");
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Session logout error:", error);
    return NextResponse.json({ error: "Failed to clear session" }, { status: 500 });
  }
}
