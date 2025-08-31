
import { db } from "./server";
import { AppUser } from "@/app/auth/actions";
import { SubscriptionPlan, Payment, SupportTicket, BrandingSettings, Subscription } from "@/lib/types";
import { firestore } from "firebase-admin";

const USERS_COLLECTION = "users";
const PLANS_COLLECTION = "subscriptionPlans";
const PAYMENTS_COLLECTION = "payments";
const SUPPORT_TICKETS_COLLECTION = "supportTickets";
const BRANDING_SETTINGS_COLLECTION = "branding";


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

// This is a placeholder until full subscription logic is implemented.
// It fetches the first available plan and treats it as the user's subscription.
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
    const plans = await getPlans();
    if (plans.length === 0) {
        return null;
    }
    const firstPlan = plans[0];

    // In a real app, you'd fetch the user's specific subscription record.
    // For now, we'll create a mock subscription object.
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    return {
        planId: firstPlan.id,
        planName: firstPlan.name,
        status: 'active',
        price: firstPlan.price,
        speed: firstPlan.speed,
        dataLimit: firstPlan.dataLimit === 0 ? 'Unlimited' : firstPlan.dataLimit,
        nextBillingDate: nextBillingDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
}


// Payment Functions
export async function getPayments(): Promise<Payment[]> {
  const snapshot = await db.collection(PAYMENTS_COLLECTION).orderBy("date", "desc").get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
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

export async function getUserPayments(userId: string): Promise<Payment[]> {
    const snapshot = await db.collection(PAYMENTS_COLLECTION)
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .get();

    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            customer: data.customer,
            email: data.email,
            plan: data.plan,
            status: data.status,
            amount: data.amount,
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

// Branding Functions
export async function getBrandingSettings(): Promise<BrandingSettings | null> {
    try {
        const doc = await db.collection(BRANDING_SETTINGS_COLLECTION).doc('config').get();
        if (!doc.exists) {
            return null;
        }
        return doc.data() as BrandingSettings;
    } catch (error) {
        console.error("Error getting branding settings:", error);
        if ((error as any).code === 'permission-denied' && process.env.NODE_ENV === 'development') {
            console.warn("Firestore permission denied. This might be because you're running in the emulator without auth. Returning default branding.");
            return null;
        }
        return null;
    }
}


export async function updateBrandingSettings(settings: BrandingSettings): Promise<void> {
    await db.collection(BRANDING_SETTINGS_COLLECTION).doc('config').set(settings, { merge: true });
}
