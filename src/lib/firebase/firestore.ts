
import { AppUser } from "@/app/auth/actions";
import { SubscriptionPlan, Payment, SupportTicket, BrandingSettings, Subscription, Notification, UserSettings, HeroSettings } from "@/lib/types";
import { collection, getDocs, getDoc, doc, updateDoc, addDoc, query, where, orderBy, setDoc, deleteDoc, writeBatch, Firestore } from "firebase/firestore";

const USERS_COLLECTION = "users";
const PLANS_COLLECTION = "subscriptionPlans";
const PAYMENTS_COLLECTION = "payments";
const SUPPORT_TICKETS_COLLECTION = "supportTickets";
const BRANDING_SETTINGS_COLLECTION = "branding";
const NOTIFICATIONS_COLLECTION = "notifications";
const LANDING_PAGE_COLLECTION = "landingPage";

// User & Role Functions
export async function createUser(db: Firestore, uid: string, name:string, email: string, role: string, photoURL?: string): Promise<void> {
  await setDoc(doc(db, USERS_COLLECTION, uid), {
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

export async function getUser(db: Firestore, uid: string): Promise<AppUser | null> {
  const docRef = doc(db, USERS_COLLECTION, uid);
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

export async function updateUser(db: Firestore, uid: string, data: Partial<AppUser>): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, data);
}


export async function getUsers(db: Firestore): Promise<AppUser[]> {
  const q = query(collection(db, USERS_COLLECTION));
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
export async function getPlans(db: Firestore): Promise<SubscriptionPlan[]> {
  const q = query(collection(db, PLANS_COLLECTION));
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

export async function getPlan(db: Firestore, id: string): Promise<SubscriptionPlan | null> {
  const docRef = doc(db, PLANS_COLLECTION, id);
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


export async function getUserSubscription(db: Firestore, userId: string): Promise<Subscription | null> {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists() || !userDoc.data()?.subscriptionPlanId) {
        return null;
    }
    const user = userDoc.data();
    const planId = user?.subscriptionPlanId;

    const plan = await getPlan(db, planId);
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

export async function updateUserSubscription(db: Firestore, userId: string, planId: string): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, { subscriptionPlanId: planId });
}


// Payment Functions
export async function getPayments(db: Firestore): Promise<Payment[]> {
  const q = query(collection(db, PAYMENTS_COLLECTION), orderBy("date", "desc"));
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

export async function getUserPayments(db: Firestore, userId: string): Promise<Payment[]> {
    const q = query(collection(db, PAYMENTS_COLLECTION), where('userId', '==', userId), orderBy('date', 'desc'));
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
export async function createSupportTicket(db: Firestore, ticketData: Omit<SupportTicket, 'id'>): Promise<void> {
    await addDoc(collection(db, SUPPORT_TICKETS_COLLECTION), ticketData);
}

export async function updateSupportTicket(db: Firestore, ticketId: string, data: Partial<SupportTicket>): Promise<void> {
    const docRef = doc(db, SUPPORT_TICKETS_COLLECTION, ticketId);
    await updateDoc(docRef, data);
}

export async function getSupportTickets(db: Firestore): Promise<SupportTicket[]> {
  const q = query(collection(db, SUPPORT_TICKETS_COLLECTION), orderBy("lastUpdated", "desc"));
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

export async function getUserSupportTickets(db: Firestore, userId: string): Promise<SupportTicket[]> {
    const q = query(collection(db, SUPPORT_TICKETS_COLLECTION), where('userId', '==', userId), orderBy('lastUpdated', 'desc'));
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

export async function getSupportTicket(db: Firestore, id: string): Promise<SupportTicket | null> {
    const docRef = doc(db, SUPPORT_TICKETS_COLLECTION, id);
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
export async function getBrandingSettings(db: Firestore): Promise<BrandingSettings | null> {
    try {
        const docRef = doc(db, BRANDING_SETTINGS_COLLECTION, 'config');
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

export async function updateBrandingSettings(db: Firestore, settings: BrandingSettings): Promise<void> {
    const docRef = doc(db, BRANDING_SETTINGS_COLLECTION, 'config');
    await setDoc(docRef, settings, { merge: true });
}

// Landing Page Functions
export async function getHeroSettings(db: Firestore): Promise<HeroSettings | null> {
    try {
        const docRef = doc(db, LANDING_PAGE_COLLECTION, 'hero');
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

export async function updateHeroSettings(db: Firestore, settings: HeroSettings): Promise<void> {
    const docRef = doc(db, LANDING_PAGE_COLLECTION, 'hero');
    await setDoc(docRef, settings, { merge: true });
}


// Notification Functions
export async function createNotification(db: Firestore, notificationData: Omit<Notification, 'id'>): Promise<void> {
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), notificationData);
}

export async function getUserNotifications(db: Firestore, userId: string): Promise<Notification[]> {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION), where('userId', '==', userId), orderBy('createdAt', 'desc'));
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

export async function getAllNotifications(db: Firestore): Promise<Notification[]> {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION), orderBy('createdAt', 'desc'));
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

export async function updateNotification(db: Firestore, notificationId: string, data: Partial<Notification>): Promise<void> {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(docRef, data);
}

export async function deleteNotification(db: Firestore, notificationId: string): Promise<void> {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await deleteDoc(docRef);
}

export async function deleteAllUserNotifications(db: Firestore, userId: string): Promise<void> {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}

export async function markAllUserNotificationsAsRead(db: Firestore, userId: string): Promise<void> {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION), where('userId', '==', userId), where('isRead', '==', false));
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
}

export async function deleteAllNotifications(db: Firestore, ): Promise<void> {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION));
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}


// User Settings
export async function getUserSettings(db: Firestore, userId: string): Promise<UserSettings | null> {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return data?.settings || null;
}

export async function updateUserSettings(db: Firestore, userId: string, settings: UserSettings): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, { settings: settings });
}
