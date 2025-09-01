
"use server";

import { db } from "./server";
import { 
    getUsers as getUsersFirestore,
    getPlans as getPlansFirestore,
    getPlan as getPlanFirestore,
    getBrandingSettings as getBrandingSettingsFirestore,
    getHeroSettings as getHeroSettingsFirestore,
    getPayments as getPaymentsFirestore,
    getUserSubscription as getUserSubscriptionFirestore,
    getSupportTickets as getSupportTicketsFirestore,
    getSupportTicket as getSupportTicketFirestore,
    getAllNotifications as getAllNotificationsFirestore,
    getUserSettings as getUserSettingsFirestore,
    getUser as getUserFirestore,
    createNotification as createNotificationFirestore,
    updateSupportTicket as updateSupportTicketFirestore,
    deleteAllNotifications as deleteAllNotificationsFirestore,
    updateUser as updateUserFirestore,
    createSupportTicket as createSupportTicketFirestore,
    updateUserSettings as updateUserSettingsFirestore,
    updateHeroSettings as updateHeroSettingsFirestore,
    updateBrandingSettings as updateBrandingSettingsFirestore,
    updateNotification as updateNotificationFirestore,
    deleteNotification as deleteNotificationFirestore,
    deleteAllUserNotifications as deleteAllUserNotificationsFirestore,
    markAllUserNotificationsAsRead as markAllUserNotificationsAsReadFirestore,
    getUserPayments as getUserPaymentsFirestore,
    getUserNotifications as getUserNotificationsFirestore,
    getUserSupportTickets as getUserSupportTicketsFirestore,
} from "./firestore";
import type { AppUser } from "@/app/auth/actions";
import type { BrandingSettings, HeroSettings, Notification, Payment, Subscription, SubscriptionPlan, SupportTicket, UserSettings } from "../types";

export async function getUsers(): Promise<AppUser[]> {
    return getUsersFirestore(db);
}

export async function getUser(uid: string): Promise<AppUser | null> {
    return getUserFirestore(db, uid);
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

export async function getSupportTickets(): Promise<SupportTicket[]> {
    return getSupportTicketsFirestore(db);
}

export async function getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    return getUserSupportTicketsFirestore(db, userId);
}

export async function getSupportTicket(id: string): Promise<SupportTicket | null> {
    return getSupportTicketFirestore(db, id);
}

export async function getAllNotifications(): Promise<Notification[]> {
    return getAllNotificationsFirestore(db);
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
    return getUserNotificationsFirestore(db, userId);
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
    return getUserSettingsFirestore(db, userId);
}

export async function createNotification(notificationData: Omit<Notification, 'id'>): Promise<void> {
    return createNotificationFirestore(db, notificationData);
}

export async function updateSupportTicket(ticketId: string, data: Partial<SupportTicket>): Promise<void> {
    return updateSupportTicketFirestore(db, ticketId, data);
}

export async function deleteAllNotifications(): Promise<void> {
    return deleteAllNotificationsFirestore(db);
}

export async function updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
    return updateUserFirestore(db, uid, data);
}

export async function createSupportTicket(ticketData: Omit<SupportTicket, 'id'>): Promise<void> {
    return createSupportTicketFirestore(db, ticketData);
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
