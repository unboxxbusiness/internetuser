
import { db } from "./server";
import { AppUser } from "@/app/auth/actions";
import { SubscriptionPlan, Payment, SupportTicket, BrandingSettings, Subscription, Notification, UserSettings } from "@/lib/types";

const USERS_COLLECTION = "users";
const PLANS_COLLECTION = "subscriptionPlans";
const PAYMENTS_COLLECTION = "payments";
const SUPPORT_TICKETS_COLLECTION = "supportTickets";
const BRANDING_SETTINGS_COLLECTION = "branding";
const NOTIFICATIONS_COLLECTION = "notifications";


// User & Role Functions
export async function createUser(uid: string, name:string, email: string, role: string, photoURL?: string): Promise<void> {
  await db.collection(USERS_COLLECTION).doc(uid).set({
    uid,
    name,
    email,
    role,
    photoURL,
    // Default settings for new users
    settings: {
        paperlessBilling: true,
        paymentReminders: true,
    }
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


export async function getUserSubscription(userId: string): Promise<Subscription | null> {
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
    if (!userDoc.exists || !userDoc.data()?.subscriptionPlanId) {
        return null;
    }
    const user = userDoc.data();
    const planId = user?.subscriptionPlanId;

    const plan = await getPlan(planId);
    if (!plan) return null;

    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    return {
        planId: plan.id,
        planName: plan.name,
        status: 'active',
        price: plan.price,
        speed: plan.speed,
        dataLimit: plan.dataLimit === 0 ? 'Unlimited' : plan.dataLimit,
        nextBillingDate: nextBillingDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
}

export async function updateUserSubscription(userId: string, planId: string): Promise<void> {
    await db.collection(USERS_COLLECTION).doc(userId).update({
        subscriptionPlanId: planId
    });
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
export async function createSupportTicket(ticketData: Omit<SupportTicket, 'id'>): Promise<void> {
    await db.collection(SUPPORT_TICKETS_COLLECTION).add(ticketData);
}

export async function updateSupportTicket(ticketId: string, data: Partial<SupportTicket>): Promise<void> {
    await db.collection(SUPPORT_TICKETS_COLLECTION).doc(ticketId).update(data);
}

export async function getSupportTickets(): Promise<SupportTicket[]> {
  const snapshot = await db.collection(SUPPORT_TICKETS_COLLECTION).orderBy("lastUpdated", "desc").get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
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

export async function getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    const snapshot = await db.collection(SUPPORT_TICKETS_COLLECTION)
        .where('userId', '==', userId)
        .orderBy('lastUpdated', 'desc')
        .get();

    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
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
        userId: data.userId,
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
        return null;
    }
}

export async function updateBrandingSettings(settings: BrandingSettings): Promise<void> {
    await db.collection(BRANDING_SETTINGS_COLLECTION).doc('config').set(settings, { merge: true });
}

// Notification Functions
export async function createNotification(notificationData: Omit<Notification, 'id'>): Promise<void> {
    await db.collection(NOTIFICATIONS_COLLECTION).add(notificationData);
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
    const snapshot = await db.collection(NOTIFICATIONS_COLLECTION)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: data.type,
            isRead: data.isRead,
            createdAt: data.createdAt.toDate(),
        };
    });
}


// User Settings
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
    const doc = await db.collection(USERS_COLLECTION).doc(userId).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return data?.settings || null;
}

export async function updateUserSettings(userId: string, settings: UserSettings): Promise<void> {
    await db.collection(USERS_COLLECTION).doc(userId).update({
        settings: settings
    });
}
