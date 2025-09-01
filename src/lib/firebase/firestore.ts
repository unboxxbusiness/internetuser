
import { db as serverDb } from "./server";
import { db as clientDb } from "./client";
import { AppUser } from "@/app/auth/actions";
import { SubscriptionPlan, Payment, SupportTicket, BrandingSettings, Subscription, Notification, UserSettings, HeroSettings } from "@/lib/types";
import { collection, getDocs, getDoc, doc, updateDoc, addDoc, query, where, orderBy, setDoc, deleteDoc, writeBatch } from "firebase/firestore";

const USERS_COLLECTION = "users";
const PLANS_COLLECTION = "subscriptionPlans";
const PAYMENTS_COLLECTION = "payments";
const SUPPORT_TICKETS_COLLECTION = "supportTickets";
const BRANDING_SETTINGS_COLLECTION = "branding";
const NOTIFICATIONS_COLLECTION = "notifications";
const LANDING_PAGE_COLLECTION = "landingPage";

function getDb(useServer: boolean = false) {
    // This function is a placeholder for a better solution
    // to distinguish between server and client environments.
    // For now, we assume server if headers() are available.
    try {
        // `headers()` is a Next.js function that only works in Server Components.
        // If it runs, we are on the server. If it throws, we are on the client.
        if (typeof window === 'undefined') {
          return serverDb;
        }
        return clientDb;
    } catch (error) {
        return clientDb;
    }
}


// User & Role Functions
export async function createUser(uid: string, name:string, email: string, role: string, photoURL?: string): Promise<void> {
  await setDoc(doc(getDb(), USERS_COLLECTION, uid), {
    uid,
    name,
    email,
    role,
    photoURL,
    settings: {
        paperlessBilling: true,
        paymentReminders: true,
    }
  });
}

export async function getUser(uid: string): Promise<AppUser | null> {
  const docRef = doc(getDb(), USERS_COLLECTION, uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  const data = docSnap.data()
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
  const docRef = doc(getDb(), USERS_COLLECTION, uid);
  await updateDoc(docRef, data);
}


export async function getUsers(): Promise<AppUser[]> {
  const q = query(collection(getDb(), USERS_COLLECTION));
  const snapshot = await getDocs(q);
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
  const q = query(collection(getDb(), PLANS_COLLECTION));
  const snapshot = await getDocs(q);
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
  const docRef = doc(getDb(), PLANS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  const data = docSnap.data();
  if (!data) return null;
  
  return {
    id: docSnap.id,
    name: data.name,
    price: data.price,
    speed: data.speed,
    dataLimit: data.dataLimit,
  };
}


export async function getUserSubscription(userId: string): Promise<Subscription | null> {
    const userDocRef = doc(getDb(), USERS_COLLECTION, userId);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists() || !userDoc.data()?.subscriptionPlanId) {
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
    const docRef = doc(getDb(), USERS_COLLECTION, userId);
    await updateDoc(docRef, { subscriptionPlanId: planId });
}


// Payment Functions
export async function getPayments(): Promise<Payment[]> {
  const q = query(collection(getDb(), PAYMENTS_COLLECTION), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
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

export async function getUserPayments(userId: string): Promise<Payment[]> {
    const q = query(collection(getDb(), PAYMENTS_COLLECTION), where('userId', '==', userId), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

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
    await addDoc(collection(getDb(), SUPPORT_TICKETS_COLLECTION), ticketData);
}

export async function updateSupportTicket(ticketId: string, data: Partial<SupportTicket>): Promise<void> {
    const docRef = doc(getDb(), SUPPORT_TICKETS_COLLECTION, ticketId);
    await updateDoc(docRef, data);
}

export async function getSupportTickets(): Promise<SupportTicket[]> {
  const q = query(collection(getDb(), SUPPORT_TICKETS_COLLECTION), orderBy("lastUpdated", "desc"));
  const snapshot = await getDocs(q);
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
    const q = query(collection(getDb(), SUPPORT_TICKETS_COLLECTION), where('userId', '==', userId), orderBy('lastUpdated', 'desc'));
    const snapshot = await getDocs(q);

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
    const docRef = doc(getDb(), SUPPORT_TICKETS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    const data = docSnap.data();
    if (!data) return null;

    return {
        id: docSnap.id,
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
        const docRef = doc(getDb(true), BRANDING_SETTINGS_COLLECTION, 'config');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return null;
        }
        return docSnap.data() as BrandingSettings;
    } catch (error) {
        console.error("Error getting branding settings:", error);
        return null;
    }
}

export async function updateBrandingSettings(settings: BrandingSettings): Promise<void> {
    const docRef = doc(getDb(), BRANDING_SETTINGS_COLLECTION, 'config');
    await setDoc(docRef, settings, { merge: true });
}

// Landing Page Functions
export async function getHeroSettings(): Promise<HeroSettings | null> {
    try {
        const docRef = doc(getDb(true), LANDING_PAGE_COLLECTION, 'hero');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return null;
        }
        return docSnap.data() as HeroSettings;
    } catch (error) {
        console.error("Error getting hero settings:", error);
        return null;
    }
}

export async function updateHeroSettings(settings: HeroSettings): Promise<void> {
    const docRef = doc(getDb(), LANDING_PAGE_COLLECTION, 'hero');
    await setDoc(docRef, settings, { merge: true });
}


// Notification Functions
export async function createNotification(notificationData: Omit<Notification, 'id'>): Promise<void> {
    await addDoc(collection(getDb(), NOTIFICATIONS_COLLECTION), notificationData);
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
    const q = query(collection(getDb(), NOTIFICATIONS_COLLECTION), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

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

export async function getAllNotifications(): Promise<Notification[]> {
    const q = query(collection(getDb(), NOTIFICATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

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

export async function updateNotification(notificationId: string, data: Partial<Notification>): Promise<void> {
    const docRef = doc(getDb(), NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(docRef, data);
}

export async function deleteNotification(notificationId: string): Promise<void> {
    const docRef = doc(getDb(), NOTIFICATIONS_COLLECTION, notificationId);
    await deleteDoc(docRef);
}

export async function deleteAllUserNotifications(userId: string): Promise<void> {
    const q = query(collection(getDb(), NOTIFICATIONS_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(getDb());
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}

export async function markAllUserNotificationsAsRead(userId: string): Promise<void> {
    const q = query(collection(getDb(), NOTIFICATIONS_COLLECTION), where('userId', '==', userId), where('isRead', '==', false));
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(getDb());
    snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
}

export async function deleteAllNotifications(): Promise<void> {
    const q = query(collection(getDb(), NOTIFICATIONS_COLLECTION));
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(getDb());
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}


// User Settings
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
    const docRef = doc(getDb(), USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return data?.settings || null;
}

export async function updateUserSettings(userId: string, settings: UserSettings): Promise<void> {
    const docRef = doc(getDb(), USERS_COLLECTION, userId);
    await updateDoc(docRef, { settings: settings });
}
