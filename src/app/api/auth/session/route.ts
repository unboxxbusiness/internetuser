
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth as adminAuth } from "@/lib/firebase/server";
import { getUser as getServerUser } from "@/lib/firebase/server-actions";

export async function POST(req: NextRequest) {
    const authorization = req.headers.get("Authorization");
    if (authorization?.startsWith("Bearer ")) {
        const idToken = authorization.split("Bearer ")[1];
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

        try {
            const sessionCookie = await adminAuth.createSessionCookie(idToken, {
                expiresIn,
            });
            cookies().set("session", sessionCookie, {
                maxAge: expiresIn,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            // Get user role to return to client
            const decodedClaims = await adminAuth.verifyIdToken(idToken);
            const user = await getServerUser(decodedClaims.uid);

            return NextResponse.json({ status: 'success', role: user?.role || 'user' }, { status: 200 });
        } catch (error) {
            console.error("Error creating session cookie", error);
            return NextResponse.json({ status: 'error', message: 'Failed to create session' }, { status: 401 });
        }
    }
    return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
}
