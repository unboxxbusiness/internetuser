
import "client-only";

import { db } from "./client";
import { 
    createUser as createFirestoreUser, 
    updateUser as updateFirestoreUser,
    updateBrandingSettings as updateBrandingSettingsFirestore,
    createSupportTicket as createSupportTicketFirestore,
    updateUserSubscription as updateUserSubscriptionFirestore,
    updateUserSettings as updateUserSettingsFirestore,
    updateHeroSettings as updateHeroSettingsFirestore,
    getUserPayments as getUserPaymentsFirestore,
    getUserSupportTickets as getUserSupportTicketsFirestore,
    getUserNotifications as getUserNotificationsFirestore,
    updateNotification as updateNotificationFirestore,
    deleteNotification as deleteNotificationFirestore,
    deleteAllUserNotifications as deleteAllUserNotificationsFirestore,
    markAllUserNotificationsAsRead as markAllUserNotificationsAsReadFirestore,
} from "./firestore";
import { AppUser } from "@/app/auth/actions";
import { BrandingSettings, HeroSettings, Notification, Payment, SupportTicket, UserSettings } from "../types";

export async function createUser(uid: string, name:string, email: string, role: string, photoURL?: string): Promise<void> {
    return createFirestoreUser(db, uid, name, email, role, photoURL);
}

export async function updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
    return updateFirestoreUser(db, uid, data);
}

export async function updateBrandingSettings(settings: BrandingSettings): Promise<void> {
    return updateBrandingSettingsFirestore(db, settings);
}

export async function updateHeroSettings(settings: HeroSettings): Promise<void> {
    return updateHeroSettingsFirestore(db, settings);
}

export async function createSupportTicket(ticketData: Omit<SupportTicket, 'id'>): Promise<void> {
    return createSupportTicketFirestore(db, ticketData);
}

export async function updateUserSubscription(userId: string, planId: string): Promise<void> {
    return updateUserSubscriptionFirestore(db, userId, planId);
}

export async function updateUserSettings(userId: string, settings: UserSettings): Promise<void> {
    return updateUserSettingsFirestore(db, userId, settings);
}

export async function getUserPayments(userId: string): Promise<Payment[]> {
    return getUserPaymentsFirestore(db, userId);
}

export async function getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    return getUserSupportTicketsFirestore(db, userId);
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
    return getUserNotificationsFirestore(db, userId);
}

export async function updateNotification(notificationId: string, data: Partial<Notification>): Promise<void> {
    return updateNotificationFirestore(db, notificationId, data);
}

export async function deleteNotification(notificationId: string): Promise<void> {
    return deleteNotificationFirestore(db, notificationId);
}

export async function deleteAllUserNotifications(userId: string): Promise<void> {
    return deleteAllUserNotificationsFirestore(db, userId);
}

export async function markAllUserNotificationsAsRead(userId: string): Promise<void> {
    return markAllUserNotificationsAsReadFirestore(db, userId);
}
