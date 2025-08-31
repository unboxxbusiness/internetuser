import { db } from "./server";
import { AppUser } from "@/app/auth/actions";
import { SubscriptionPlan, Payment, SupportTicket } from "@/lib/types";

const USERS_COLLECTION = "users";
const PLANS_COLLECTION = "subscriptionPlans";
const PAYMENTS_COLLECTION = "payments";
const SUPPORT_TICKETS_COLLECTION = "supportTickets";


// User & Role Functions
export async function createUser(uid: string, name:string, email: string, role: string, photoURL?: string): Promise<void> {
  await db.collection(USERS_COLLECTION).doc(uid).set({
    uid,
    name,
    email,
    role,
    photoURL,
  });
}

export async function getUser(uid: string): Promise<AppUser | null> {
  const doc = await db.collection(USERS_COLLECTION).doc(uid).get();
  if (!doc.exists) {
    return null;
  }
  const data = doc.data()
  if (!data) return null;
  
  return {
    uid: data.uid,
    email: data.email,
    name: data.name,
    photoURL: data.photoURL,
    role: data.role,
  };
}

export async function updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
  await db.collection(USERS_COLLECTION).doc(uid).update(data);
}


export async function getUsers(): Promise<AppUser[]> {
  const snapshot = await db.collection(USERS_COLLECTION).get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: data.uid,
      name: data.name,
      email: data.email,
      role: data.role,
      photoURL: data.photoURL,
    };
  });
}

// Subscription Plan Functions
export async function getPlans(): Promise<SubscriptionPlan[]> {
  const snapshot = await db.collection(PLANS_COLLECTION).get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      price: data.price,
      speed: data.speed,
      dataLimit: data.dataLimit,
    };
  });
}

export async function getPlan(id: string): Promise<SubscriptionPlan | null> {
  const doc = await db.collection(PLANS_COLLECTION).doc(id).get();
  if (!doc.exists) {
    return null;
  }
  const data = doc.data();
  if (!data) return null;
  
  return {
    id: doc.id,
    name: data.name,
    price: data.price,
    speed: data.speed,
    dataLimit: data.dataLimit,
  };
}

// Payment Functions
export async function getPayments(): Promise<Payment[]> {
  const snapshot = await db.collection(PAYMENTS_COLLECTION).orderBy("date", "desc").get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      customer: data.customer,
      email: data.email,
      plan: data.plan,
      status: data.status,
      amount: data.amount,
      // Convert Firestore Timestamp to JavaScript Date
      date: (data.date.toDate ? data.date.toDate() : new Date(data.date)),
    };
  });
}

// Support Ticket Functions
export async function getSupportTickets(): Promise<SupportTicket[]> {
  const snapshot = await db.collection(SUPPORT_TICKETS_COLLECTION).orderBy("lastUpdated", "desc").get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      subject: data.subject,
      description: data.description,
      user: data.user,
      status: data.status,
      priority: data.priority,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
    };
  });
}

export async function getSupportTicket(id: string): Promise<SupportTicket | null> {
    const doc = await db.collection(SUPPORT_TICKETS_COLLECTION).doc(id).get();
    if (!doc.exists) {
        return null;
    }
    const data = doc.data();
    if (!data) return null;

    return {
        id: doc.id,
        subject: data.subject,
        description: data.description,
        user: data.user,
        status: data.status,
        priority: data.priority,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
    };
}
