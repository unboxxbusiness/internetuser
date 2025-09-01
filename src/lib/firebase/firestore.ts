
import "server-only";

import type { AppUser } from "@/app/auth/actions";
import type { SubscriptionPlan, Payment, SupportTicket, BrandingSettings, Subscription, Notification, UserSettings, HeroSettings, TicketMessage } from "@/lib/types";
import type { Firestore, FieldValue } from "firebase-admin/firestore";

const USERS_COLLECTION = "users";
const PLANS_COLLECTION = "subscriptionPlans";
const PAYMENTS_COLLECTION = "payments";
const SUPPORT_TICKETS_COLLECTION = "supportTickets";
const BRANDING_SETTINGS_COLLECTION = "branding";
const NOTIFICATIONS_COLLECTION = "notifications";
const LANDING_PAGE_COLLECTION = "landingPage";

// User & Role Functions
export async function createUser(db: Firestore, uid: string, name:string, email: string, role: string, photoURL?: string): Promise<void> {
  await db.collection(USERS_COLLECTION).doc(uid).set({
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
  const docRef = db.collection(USERS_COLLECTION).doc(uid);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    return null;
  }
  const data = docSnap.data()
  if (!data) return null;

  let paymentStatus: AppUser['paymentStatus'] = 'pending';
  if (data.role === 'admin') {
      paymentStatus = 'N/A';
  } else {
      const payments = await getUserPayments(db, uid);
      const hasPaid = payments.some(p => p.status === 'succeeded');
      paymentStatus = hasPaid ? 'paid' : 'pending';
  }
  
  return {
    uid: data.uid,
    email: data.email,
    name: data.name,
    photoURL: data.photoURL,
    role: data.role,
    accountStatus: 'active', // Placeholder
    paymentStatus: paymentStatus,
  };
}

export async function updateUser(db: Firestore, uid: string, data: Partial<AppUser>): Promise<void> {
  const docRef = db.collection(USERS_COLLECTION).doc(uid);
  await docRef.update(data);
}


export async function getUsers(db: Firestore): Promise<AppUser[]> {
  const usersSnapshot = await db.collection(USERS_COLLECTION).get();
  const paymentsSnapshot = await db.collection(PAYMENTS_COLLECTION).where('status', '==', 'succeeded').get();

  const successfulPaymentUserIds = new Set(paymentsSnapshot.docs.map(doc => doc.data().userId));

  return usersSnapshot.docs.map((doc) => {
    const data = doc.data();
    
    let paymentStatus: AppUser['paymentStatus'] = 'pending';
    if (data.role === 'admin') {
        paymentStatus = 'N/A';
    } else {
        const hasPaid = successfulPaymentUserIds.has(data.uid);
        paymentStatus = hasPaid ? 'paid' : 'pending';
    }

    return {
      uid: data.uid,
      name: data.name,
      email: data.email,
      role: data.role,
      photoURL: data.photoURL,
      accountStatus: 'active', // Placeholder, can be enhanced later
      paymentStatus: paymentStatus,
    };
  });
}

// Subscription Plan Functions
export async function getPlans(db: Firestore): Promise<SubscriptionPlan[]> {
  const q = db.collection(PLANS_COLLECTION);
  const snapshot = await q.get();
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
  const docRef = db.collection(PLANS_COLLECTION).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
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
    const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists || !userDoc.data()?.subscriptionPlanId) {
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
    const docRef = db.collection(USERS_COLLECTION).doc(userId);
    await docRef.update({ subscriptionPlanId: planId });
}


// Payment Functions
export async function getPayments(db: Firestore): Promise<Payment[]> {
  const q = db.collection(PAYMENTS_COLLECTION).orderBy("date", "desc");
  const snapshot = await q.get();
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
    const q = db.collection(PAYMENTS_COLLECTION).where('userId', '==', userId).orderBy('date', 'desc');
    const snapshot = await q.get();

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
export async function createSupportTicket(db: Firestore, ticketData: Omit<SupportTicket, 'id' | 'messages'>): Promise<string> {
    const docRef = await db.collection(SUPPORT_TICKETS_COLLECTION).add(ticketData);
    return docRef.id;
}

export async function addTicketMessage(db: Firestore, ticketId: string, message: TicketMessage): Promise<void> {
    const docRef = db.collection(SUPPORT_TICKETS_COLLECTION).doc(ticketId);
    await docRef.update({
        messages: FieldValue.arrayUnion(message)
    });
}

export async function updateSupportTicket(db: Firestore, ticketId: string, data: Partial<SupportTicket>): Promise<void> {
    const docRef = db.collection(SUPPORT_TICKETS_COLLECTION).doc(ticketId);
    await docRef.update(data);
}

export async function getSupportTickets(db: Firestore): Promise<SupportTicket[]> {
  const q = db.collection(SUPPORT_TICKETS_COLLECTION).orderBy("lastUpdated", "desc");
  const snapshot = await q.get();
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
      messages: data.messages?.map((m: any) => ({...m, timestamp: m.timestamp.toDate()})) || [],
    };
  });
}

export async function getUserSupportTickets(db: Firestore, userId: string): Promise<SupportTicket[]> {
    const q = db.collection(SUPPORT_TICKETS_COLLECTION).where('userId', '==', userId).orderBy('lastUpdated', 'desc');
    const snapshot = await q.get();

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
            messages: data.messages?.map((m: any) => ({...m, timestamp: m.timestamp.toDate()})) || [],
        };
    });
}

export async function getSupportTicket(db: Firestore, id: string): Promise<SupportTicket | null> {
    const docRef = db.collection(SUPPORT_TICKETS_COLLECTION).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
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
        messages: data.messages?.map((m: any) => ({...m, timestamp: m.timestamp.toDate()})) || [],
    };
}

// Branding Functions
export async function getBrandingSettings(db: Firestore): Promise<BrandingSettings | null> {
    try {
        const docRef = db.collection(BRANDING_SETTINGS_COLLECTION).doc('config');
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return null;
        }
        return docSnap.data() as BrandingSettings;
    } catch (error) {
        console.error("Error getting branding settings:", error);
        return null;
    }
}

export async function updateBrandingSettings(db: Firestore, settings: BrandingSettings): Promise<void> {
    const docRef = db.collection(BRANDING_SETTINGS_COLLECTION).doc('config');
    await docRef.set(settings, { merge: true });
}

// Landing Page Functions
export async function getHeroSettings(db: Firestore): Promise<HeroSettings | null> {
    try {
        const docRef = db.collection(LANDING_PAGE_COLLECTION).doc('hero');
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return null;
        }
        return docSnap.data() as HeroSettings;
    } catch (error) {
        console.error("Error getting hero settings:", error);
        return null;
    }
}

export async function updateHeroSettings(db: Firestore, settings: HeroSettings): Promise<void> {
    const docRef = db.collection(LANDING_PAGE_COLLECTION).doc('hero');
    await docRef.set(settings, { merge: true });
}


// Notification Functions
export async function createNotification(db: Firestore, notificationData: Omit<Notification, 'id'>): Promise<void> {
    await db.collection(NOTIFICATIONS_COLLECTION).add(notificationData);
}

export async function getUserNotifications(db: Firestore, userId: string): Promise<Notification[]> {
    const q = db.collection(NOTIFICATIONS_COLLECTION).where('userId', '==', userId).orderBy('createdAt', 'desc');
    const snapshot = await q.get();

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: data.type,
            isRead: data.isRead,
            isArchived: data.isArchived,
            createdAt: data.createdAt.toDate(),
            relatedId: data.relatedId,
        };
    });
}

export async function getAllNotifications(db: Firestore): Promise<Notification[]> {
    const q = db.collection(NOTIFICATIONS_COLLECTION).orderBy('createdAt', 'desc');
    const snapshot = await q.get();

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: data.type,
            isRead: data.isRead,
            isArchived: data.isArchived,
            createdAt: data.createdAt.toDate(),
            relatedId: data.relatedId,
        };
    });
}

export async function updateNotification(db: Firestore, notificationId: string, data: Partial<Notification>): Promise<void> {
    const docRef = db.collection(NOTIFICATIONS_COLLECTION).doc(notificationId);
    await docRef.update(data);
}

export async function deleteNotification(db: Firestore, notificationId: string): Promise<void> {
    const docRef = db.collection(NOTIFICATIONS_COLLECTION).doc(notificationId);
    await docRef.delete();
}

export async function deleteAllUserNotifications(db: Firestore, userId: string): Promise<void> {
    const q = db.collection(NOTIFICATIONS_COLLECTION).where('userId', '==', userId);
    const snapshot = await q.get();
    
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}

export async function markAllUserNotificationsAsRead(db: Firestore, userId: string): Promise<void> {
    const q = db.collection(NOTIFICATIONS_COLLECTION).where('userId', '==', userId).where('isRead', '==', false);
    const snapshot = await q.get();
    
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
}

export async function archiveNotification(db: Firestore, notificationId: string): Promise<void> {
    const docRef = db.collection(NOTIFICATIONS_COLLECTION).doc(notificationId);
    await docRef.update({ isArchived: true });
}

export async function archiveAllReadUserNotifications(db: Firestore, userId: string): Promise<void> {
    const q = db.collection(NOTIFICATIONS_COLLECTION).where('userId', '==', userId).where('isRead', '==', true).where('isArchived', '==', false);
    const snapshot = await q.get();
    
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { isArchived: true });
    });

    await batch.commit();
}

export async function deleteAllNotifications(db: Firestore): Promise<void> {
    const q = db.collection(NOTIFICATIONS_COLLECTION);
    const snapshot = await q.get();
    
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}


// User Settings
export async function getUserSettings(db: Firestore, userId: string): Promise<UserSettings | null> {
    const docRef = db.collection(USERS_COLLECTION).doc(userId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;
    const data = docSnap.data();
    return data?.settings || null;
}

export async function updateUserSettings(db: Firestore, userId: string, settings: UserSettings): Promise<void> {
    const docRef = db.collection(USERS_COLLECTION).doc(userId);
    await docRef.update({ settings: settings });
}
