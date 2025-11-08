

"use server";

import { db, messaging } from "./server";
import { 
    getUsers as getUsersFirestore,
    getPlans as getPlansFirestore,
    getPlan as getPlanFirestore,
    getBrandingSettings as getBrandingSettingsFirestore,
    getHeroSettings as getHeroSettingsFirestore,
    getPayments as getPaymentsFirestore,
    getUserSubscription as getUserSubscriptionFirestore,
    getUserSettings as getUserSettingsFirestore,
    getUser as getUserFirestore,
    createUser as createUserFirestore,
    updateUser as updateUserFirestore,
    updateUserSettings as updateUserSettingsFirestore,
    updateHeroSettings as updateHeroSettingsFirestore,
    updateBrandingSettings as updateBrandingSettingsFirestore,
    getUserPayments as getUserPaymentsFirestore,
    createNotification as createNotificationFirestore,
    getNotifications as getNotificationsFirestore,
} from "./firestore";
import type { AppUser } from "@/app/auth/actions";
import type { BrandingSettings, HeroSettings, Notification, Payment, Subscription, SubscriptionPlan, UserSettings } from "../types";
import { MulticastMessage } from "firebase-admin/messaging";

export async function getUsers(): Promise<AppUser[]> {
    return getUsersFirestore(db);
}

export async function getUser(uid: string): Promise<AppUser | null> {
    return getUserFirestore(db, uid);
}

export async function createUser(uid: string, name: string, email: string, role: string, photoURL?: string): Promise<void> {
    return createUserFirestore(db, uid, name, email, role, photoURL);
}

export async function getPlans(): Promise<SubscriptionPlan[]> {
    return getPlansFirestore(db);
}

export async function getPlan(id: string): Promise<SubscriptionPlan | null> {
    return getPlanFirestore(db, id);
}

export async function getBrandingSettings(): Promise<BrandingSettings | null> {
    return getBrandingSettingsFirestore(db);
}

export async function getHeroSettings(): Promise<HeroSettings | null> {
    return getHeroSettingsFirestore(db);
}

export async function getPayments(): Promise<Payment[]> {
    return getPaymentsFirestore(db);
}

export async function getUserPayments(userId: string): Promise<Payment[]> {
    return getUserPaymentsFirestore(db, userId);
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
    return getUserSubscriptionFirestore(db, userId);
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
    return getUserSettingsFirestore(db, userId);
}

export async function updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
    return updateUserFirestore(db, uid, data);
}

export async function updateUserSettings(userId: string, settings: UserSettings): Promise<void> {
    return updateUserSettingsFirestore(db, userId, settings);
}

export async function updateHeroSettings(settings: HeroSettings): Promise<void> {
    return updateHeroSettingsFirestore(db, settings);
}

export async function updateBrandingSettings(settings: BrandingSettings): Promise<void> {
    return updateBrandingSettingsFirestore(db, settings);
}

export async function sendPushNotification(title: string, body: string, userId?: string) {
    const users = await getUsers();
    const targetUsers = userId ? users.filter(u => u.uid === userId) : users;

    const tokens = targetUsers.map(u => u.fcmToken).filter(Boolean) as string[];

    if (tokens.length === 0) {
        console.log("No FCM tokens found for target users.");
        return { success: 0, failure: targetUsers.length };
    }

    const message: MulticastMessage = {
        notification: {
            title: title,
            body: body,
        },
        tokens: tokens,
    };

    try {
        const response = await messaging.sendEachForMulticast(message);
        console.log(`Successfully sent ${response.successCount} messages`);
        
        // Save to notification history
        if (response.successCount > 0) {
            await createNotificationFirestore(db, title, body);
        }

        if (response.failureCount > 0) {
            const failedTokens: string[] = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(tokens[idx]);
                }
            });
            console.log('List of failed tokens:', failedTokens);
        }
        return { success: response.successCount, failure: response.failureCount };
    } catch (error) {
        console.error('Error sending multicast message:', error);
        return { success: 0, failure: tokens.length };
    }
}

export async function getNotifications(): Promise<Notification[]> {
    return getNotificationsFirestore(db);
}
