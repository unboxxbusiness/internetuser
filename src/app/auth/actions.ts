
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth as adminAuth } from "@/lib/firebase/server";
import { auth as clientAuth } from "@/lib/firebase/client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { createUser as createClientUser } from "@/lib/firebase/client-actions";
import { getUser as getServerUser } from "@/lib/firebase/server-actions";


export interface AppUser {
  uid: string;
  email: string | undefined;
  name: string | undefined;
  photoURL: string | undefined;
  role: string;
}

async function createSession(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn,
  });
  cookies().set("session", sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
  });
}

export async function getUser(): Promise<AppUser | null> {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    const firestoreUser = await getServerUser(decodedClaims.uid);

    if (!firestoreUser) {
        return null;
    }

    return {
      uid: firestoreUser.uid,
      email: firestoreUser.email,
      name: firestoreUser.name,
      photoURL: firestoreUser.photoURL,
      role: firestoreUser.role,
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
  revalidatePath("/", "layout");
  redirect("/");
}

export async function login(
  formData: FormData
): Promise<{ error: string } | void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  let userCredential;
  let error = "";

  try {
    userCredential = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();
    await createSession(idToken);
  } catch (e: any) {
    console.error("Login failed:", e.code, e.message);
    error = "Invalid email or password.";
  }

  if (error) {
    return { error };
  } else {
    const user = await clientAuth.currentUser;
    if (user) {
        const firestoreUser = await getServerUser(user.uid);
        const redirectTo = firestoreUser?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
        redirect(redirectTo);
    } else {
        redirect("/auth/login");
    }
  }
}

export async function signup(
  formData: FormData
): Promise<{ error: string } | void> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  let userCredential;
  let error = "";

  try {
    userCredential = await createUserWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    const { user } = userCredential;

    // Create a user document in Firestore
    await createClientUser(user.uid, name, user.email || '', "user", user.photoURL || '');

    const idToken = await user.getIdToken();
    await createSession(idToken);
  } catch (e: any) {
    console.error("Signup failed:", e.code, e.message);
    if (e.code === "auth/email-already-in-use") {
      error = "This email is already in use.";
    } else if (e.code === "auth/weak-password") {
      error = "Password should be at least 6 characters.";
    } else {
      error = "An unexpected error occurred.";
    }
  }

  if (error) {
    return { error };
  } else {
    redirect("/user/dashboard");
  }
}
