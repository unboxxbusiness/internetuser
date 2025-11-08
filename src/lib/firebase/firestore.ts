

"use server";

import "server-only";

import type { AppUser } from "@/app/auth/actions";
import type { SubscriptionPlan, Payment, BrandingSettings, Subscription, UserSettings, HeroSettings, Notification } from "@/lib/types";
import type { Firestore, FieldValue, Timestamp } from "firebase-admin/firestore";

const USERS_COLLECTION = "users";
const PLANS_COLLECTION = "subscriptionPlans";
const PAYMENTS_COLLECTION = "payments";
const BRANDING_SETTINGS_COLLECTION = "branding";
const LANDING_PAGE_COLLECTION = "landingPage";
const NOTIFICATIONS_COLLECTION = "notifications";

// Helper to convert Timestamps to serializable strings
const toSerializableObject = (obj: any): any => {
    if (!obj) return obj;

    if (Array.isArray(obj)) {
        return obj.map(toSerializableObject);
    }
    
    if (typeof obj !== 'object') {
        return obj;
    }

    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (value && typeof value.toDate === 'function') { // Firestore Timestamp
                newObj[key] = value.toDate().toISOString();
            } else if (value instanceof Date) { // JavaScript Date
                newObj[key] = value.toISOString();
            } else if (typeof value === 'object' && value !== null) {
                newObj[key] = toSerializableObject(value);
            } else {
                newObj[key] = value;
            }
        }
    }
    return newObj;
};


// User & Role Functions
export async function createUser(db: Firestore, uid: string, name:string, email: string, role: string, photoURL?: string): Promise<void> {
  await db.collection(USERS_COLLECTION).doc(uid).set({
    uid,
    name,
    email,
    role,
    photoURL,
    fcmToken: null,
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
    fcmToken: data.fcmToken || null,
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
      fcmToken: data.fcmToken || null,
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
    return toSerializableObject({
      id: doc.id,
      ...data,
    }) as Payment;
  });
}

export async function getUserPayments(db: Firestore, userId: string): Promise<Payment[]> {
    const q = db.collection(PAYMENTS_COLLECTION).where('userId', '==', userId).orderBy('date', 'desc');
    const snapshot = await q.get();

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return toSerializableObject({
            id: doc.id,
            ...data,
        }) as Payment;
    });
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

// Notification Functions
export async function createNotification(db: Firestore, subject: string, message: string): Promise<void> {
  await db.collection(NOTIFICATIONS_COLLECTION).add({
    subject,
    message,
    sentAt: new Date(),
  });
}

export async function getNotifications(db: Firestore): Promise<Notification[]> {
  const q = db.collection(NOTIFICATIONS_COLLECTION).orderBy("sentAt", "desc");
  const snapshot = await q.get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return toSerializableObject({
      id: doc.id,
      ...data,
    }) as Notification;
  });
}
