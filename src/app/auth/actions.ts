"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth as adminAuth } from "@/lib/firebase/server";
import { auth as clientAuth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import type { User } from "firebase/auth";
import { createUser, getUserRole } from "@/lib/firebase/firestore";

async function createSession(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
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
    const role = await getUserRole(decodedClaims.uid);

    return {
      ...user,
      role: role || "user",
    };
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    // Clear the invalid cookie
    cookies().delete("session");
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
  let userCredential;
  let errorMessage = null;

  try {
    userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
  } catch (error: any) {
    errorMessage = "Invalid email or password.";
  }

  if (errorMessage) {
    const headers = new Headers();
    headers.set('X-Error-Message', errorMessage);
    redirect("/auth/login", headers as any);
  }

  const idToken = await userCredential!.user.getIdToken();
  await createSession(idToken);

  const role = await getUserRole(userCredential!.user.uid);
  const redirectTo = role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  redirect(redirectTo);
}

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
  
    let userCredential;
    let errorMessage = null;

    try {
      userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
      const { uid } = userCredential.user;

      // Create a user document in Firestore
      await createUser(uid, email, "user");
      
      const idToken = await userCredential.user.getIdToken();
      await createSession(idToken);
      
    } catch (error: any) {
      console.error("Signup failed:", error.code, error.message);
      if (error.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already in use.";
      } else if (error.code === 'auth/weak-password') {
          errorMessage = "Password should be at least 6 characters.";
      } else {
        errorMessage = "An unexpected error occurred.";
      }
    }

    if (errorMessage) {
      const headers = new Headers();
      headers.set('X-Error-Message', errorMessage);
      return redirect("/auth/signup", headers as any);
    }
    
    redirect("/user/dashboard");
}
