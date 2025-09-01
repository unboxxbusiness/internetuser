
import "server-only";

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
} from "./firestore";
import { AppUser } from "@/app/auth/actions";
import { BrandingSettings, HeroSettings, Notification, Payment, Subscription, SubscriptionPlan, SupportTicket, UserSettings } from "../types";

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

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
    return getUserSubscriptionFirestore(db, userId);
}

export async function getSupportTickets(): Promise<SupportTicket[]> {
    return getSupportTicketsFirestore(db);
}

export async function getSupportTicket(id: string): Promise<SupportTicket | null> {
    return getSupportTicketFirestore(db, id);
}

export async function getAllNotifications(): Promise<Notification[]> {
    return getAllNotificationsFirestore(db);
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
