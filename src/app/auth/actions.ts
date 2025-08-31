"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { auth as adminAuth } from "@/lib/firebase/server";
import { auth as clientAuth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import type { User } from "firebase/auth";

async function createSession(uid: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(uid, { expiresIn });
  cookies().set("session", sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
  });
}

export async function getUser(): Promise<(User & { role?: string }) | null> {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const user = await adminAuth.getUser(decodedClaims.uid);
    return {
      ...user,
      role: (decodedClaims.role as string) || "user",
    };
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

export async function logout() {
  cookies().delete("session");
  redirect("/auth/login");
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const decodedToken = await getAuth().verifyIdToken(idToken);
    await createSession(decodedToken.uid);

    const role = decodedToken.role || "user";
    const redirectTo = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
    redirect(redirectTo);

  } catch (error: any) {
    console.error("Login failed:", error.message);
    const headers = new Headers();
    headers.set('X-Error-Message', 'Invalid email or password.');
    redirect("/auth/login", headers as any); // Type assertion needed for redirect with headers
  }
}

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
      const { uid } = userCredential.user;
  
      await getAuth().setCustomUserClaims(uid, { role: "user" });
      
      await createSession(uid);
      
      redirect("/user/dashboard");
    } catch (error: any) {
      console.error("Signup failed:", error.code, error.message);
      const headers = new Headers();
      let errorMessage = "An unexpected error occurred.";
      if (error.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already in use.";
      } else if (error.code === 'auth/weak-password') {
          errorMessage = "Password should be at least 6 characters.";
      }
      
      headers.set('X-Error-Message', errorMessage);
      redirect("/auth/signup", headers as any); // Type assertion needed for redirect with headers
    }
}
