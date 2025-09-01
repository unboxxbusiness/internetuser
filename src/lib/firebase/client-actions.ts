"use client";

import { db } from "./client";
import { 
    createUser as createFirestoreUser,
    getUserPayments as getUserPaymentsFirestore,
    getUserSupportTickets as getUserSupportTicketsFirestore
} from "./firestore";
import { Payment, SupportTicket } from "../types";

export async function createUser(uid: string, name:string, email: string, role: string, photoURL?: string): Promise<void> {
    return createFirestoreUser(db, uid, name, email, role, photoURL);
}

export async function getUserPayments(userId: string): Promise<Payment[]> {
    return getUserPaymentsFirestore(db, userId);
}

export async function getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    return getUserSupportTicketsFirestore(db, userId);
}
