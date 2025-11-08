
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth as adminAuth } from "@/lib/firebase/server";
import { getUser as getServerUser } from "@/lib/firebase/server-actions";


export interface AppUser {
  uid: string;
  email: string | undefined;
  name: string | undefined;
  photoURL: string | undefined;
  role: string;
  fcmToken: string | null;
  accountStatus: 'active' | 'suspended';
  paymentStatus: 'paid' | 'pending' | 'N/A';
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
      fcmToken: firestoreUser.fcmToken,
      accountStatus: firestoreUser.accountStatus,
      paymentStatus: firestoreUser.paymentStatus,
    };
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    // An invalid cookie is not a critical error, just treat the user as logged out.
    // The invalid cookie will be overwritten on next login or cleared on logout.
    return null;
  }
}

export async function logout() {
  cookies().delete("session");
  revalidatePath("/", "layout");
  redirect("/");
}
