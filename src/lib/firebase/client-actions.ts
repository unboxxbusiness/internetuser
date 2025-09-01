
"use client";

import { db } from "./client";
import { 
    createUser as createFirestoreUser
} from "./firestore";

export async function createUser(uid: string, name:string, email: string, role: string, photoURL?: string): Promise<void> {
    return createFirestoreUser(db, uid, name, email, role, photoURL);
}
