
"use server";

import { revalidatePath } from "next/cache";
import { auth as adminAuth, db } from "@/lib/firebase/server";
import { redirect } from "next/navigation";
import { getUser } from "./auth/actions";
import { 
    updateUser as updateUserServer,
    updateBrandingSettings as updateBrandingSettingsServer,
    createSupportTicket as createSupportTicketServer,
    updateUserSettings as updateUserSettingsServer,
    updateHeroSettings as updateHeroSettingsServer,
    getPlan as getPlanServer,
    getUsers as getUsersServer, 
    createNotification, 
    getSupportTicket, 
    updateSupportTicket,
    deleteAllNotifications as deleteAllNotificationsServer,
    updateNotification as updateNotificationServer,
    deleteNotification as deleteNotificationServer,
    deleteAllUserNotifications as deleteAllUserNotificationsServer,
    markAllUserNotificationsAsRead as markAllUserNotificationsAsReadServer,
    archiveNotification as archiveNotificationServer,
    archiveAllReadUserNotifications as archiveAllReadUserNotificationsServer,
    addTicketMessage,
    createUser,
} from "@/lib/firebase/server-actions";

import { BrandingSettings, HeroSettings, SupportTicket, UserSettings } from "@/lib/types";
import { randomBytes } from "crypto";
import { sha512 } from "js-sha512";

export async function deleteUserAction(uid: string) {
    try {
        // Delete from Firebase Auth
        await adminAuth.deleteUser(uid);
        // Delete from Firestore
        await db.collection("users").doc(uid).delete();
    } catch (error) {
        console.error("Error deleting user:", error);
        // Optionally, return an error message to the client
        return { error: "Failed to delete user." };
    }
    revalidatePath("/admin/users");
    return { message: "User deleted successfully." };
}

export async function resetPasswordAction(email: string): Promise<{ message?: string; error?: string }> {
    try {
        const link = await adminAuth.generatePasswordResetLink(email);
        // Here you would typically send an email with this link.
        // For this example, we'll just log it and return a success message.
        console.log("Password reset link:", link);
        return { message: `A password reset link has been sent to ${email}.` };
    } catch (error: any) {
        console.error("Error generating password reset link:", error);
         if (error.code === 'auth/user-not-found') {
            return { error: "User with this email does not exist." };
        }
        return { error: "Failed to send password reset email." };
    }
}

export async function addPlanAction(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const speed = Number(formData.get("speed"));
    const dataLimit = Number(formData.get("dataLimit"));

    await db.collection("subscriptionPlans").add({
      name,
      price,
      speed,
      dataLimit,
    });
  } catch (error) {
    console.error("Error adding plan:", error);
    return { error: "Failed to add plan." };
  }
  revalidatePath("/admin/plans");
  redirect("/admin/plans");
}

export async function updatePlanAction(id: string, prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const speed = Number(formData.get("speed"));
    const dataLimit = Number(formData.get("dataLimit"));

    await db.collection("subscriptionPlans").doc(id).update({
      name,
      price,
      speed,
      dataLimit,
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    return { error: "Failed to update plan." };
  }
  revalidatePath("/admin/plans");
  redirect("/admin/plans");
}

export async function deletePlanAction(id: string) {
  try {
    await db.collection("subscriptionPlans").doc(id).delete();
  } catch (error) {
    console.error("Error deleting plan:", error);
    return { error: "Failed to delete plan." };
  }
  revalidatePath("/admin/plans");
}

export async function sendNotificationAction(prevState: any, formData: FormData): Promise<{ message?: string; error?: string }> {
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!subject || !message) {
        return { error: 'Subject and message are required.' };
    }

    try {
        const users = await getUsersServer();
        const notificationPromises = users.map(user => 
            createNotification({
                userId: user.uid,
                title: subject,
                message: message,
                type: 'general',
                isRead: false,
                isArchived: false,
            })
        );
        await Promise.all(notificationPromises);
        
        revalidatePath('/admin/notifications');
        return { message: `Notification has been successfully sent to ${users.length} users.` };

    } catch (error) {
        console.error('Error sending notification:', error);
        return { error: 'Failed to send notification.' };
    }
}

export async function updateUserProfileAction(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { error: "You must be logged in to update your profile." };
  }

  const name = formData.get("name") as string;
  const updates: { name?: string } = {};

  if (name && name !== user.name) {
    updates.name = name;
  }

  if (Object.keys(updates).length === 0) {
    return { message: "No changes to save." };
  }

  try {
    await updateUserServer(user.uid, updates);
    revalidatePath("/admin/settings");
    revalidatePath("/user/profile");
    return { message: "Profile updated successfully." };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile." };
  }
}

export async function updateBrandingAction(prevState: any, formData: FormData): Promise<{ message?: string; error?: string }> {
    const brandName = formData.get('brandName') as string;
    const icon = formData.get('icon') as string;
    const footerText = formData.get('footerText') as string;

    const settings: BrandingSettings = {
        brandName,
        icon,
        footerText
    };

    try {
        await updateBrandingSettingsServer(settings);
        revalidatePath('/', 'layout'); // Revalidate the whole site
        return { message: 'Branding settings updated successfully.' };
    } catch (error) {
        console.error('Error updating branding settings:', error);
        return { error: 'Failed to update branding settings.' };
    }
}

export async function updateHeroAction(prevState: any, formData: FormData): Promise<{ message?: string; error?: string }> {
    const heading = formData.get('heading') as string;
    const subheading = formData.get('subheading') as string;
    const ctaText = formData.get('ctaText') as string;

    const settings: HeroSettings = {
        heading,
        subheading,
        ctaText,
    };

    try {
        await updateHeroSettingsServer(settings);
        revalidatePath('/');
        return { message: 'Landing page content updated successfully.' };
    } catch (error) {
        console.error('Error updating hero settings:', error);
        return { error: 'Failed to update landing page content.' };
    }
}


export async function createSupportTicketAction(prevState: any, formData: FormData): Promise<{ message?: string; error?: string }> {
    const user = await getUser();
    if (!user) {
        return { error: 'You must be logged in to create a ticket.' };
    }

    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as 'low' | 'medium' | 'high';

    if (!subject || !description || !priority) {
        return { error: 'Please fill out all fields.' };
    }

    const ticketData: Omit<SupportTicket, 'id' | 'messages' | 'createdAt' | 'lastUpdated'> = {
        subject,
        description,
        priority,
        userId: user.uid,
        user: {
            name: user.name || 'N/A',
            email: user.email || 'N/A'
        },
        status: 'open',
    };

    try {
        const ticketId = await createSupportTicketServer(ticketData);
        await addTicketMessage(ticketId, {
            sender: user.name || 'User',
            senderRole: 'user',
            message: description,
        });

    } catch (error) {
        console.error('Error creating support ticket:', error);
        return { error: 'Failed to create support ticket.' };
    }
    
    revalidatePath('/user/support');
    redirect('/user/support');
}


export async function adminCreateTicketAction(prevState: any, formData: FormData): Promise<{ message?: string; error?: string; ticketId?: string }> {
    const adminUser = await getUser();
    if (!adminUser || adminUser.role !== 'admin') {
        return { error: 'You do not have permission to perform this action.' };
    }

    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const targetUserId = formData.get('targetUserId') as string;
    const targetUserName = formData.get('targetUserName') as string;
    const targetUserEmail = formData.get('targetUserEmail') as string;

    if (!subject || !message || !targetUserId || !targetUserName || !targetUserEmail) {
        return { error: 'Please fill out all fields.' };
    }

    const ticketData: Omit<SupportTicket, 'id' | 'messages' | 'createdAt' | 'lastUpdated'> = {
        subject,
        description: `Conversation started by admin: ${adminUser.name}`,
        priority: 'medium', // Default priority for admin-initiated chats
        userId: targetUserId,
        user: {
            name: targetUserName,
            email: targetUserEmail
        },
        status: 'open',
    };

    try {
        const ticketId = await createSupportTicketServer(ticketData);
        
        // Add the admin's first message
        await addTicketMessage(ticketId, {
            sender: adminUser.name || 'Admin',
            senderRole: 'admin',
            message: message,
        });
        
        // Notify the user that a chat has been started
        await createNotification({
            userId: targetUserId,
            title: `A new message from support: "${subject}"`,
            message: message,
            type: 'support',
            isRead: false,
            isArchived: false,
            relatedId: ticketId
        });

        revalidatePath(`/admin/support`);
        revalidatePath(`/user/support`);

        return { message: "Chat started successfully.", ticketId: ticketId };

    } catch (error) {
        console.error('Error creating ticket by admin:', error);
        return { error: 'Failed to start chat.' };
    }
}


export async function changeUserPasswordAction(prevState: any, formData: FormData): Promise<{ message?: string; error?: string }> {
    const user = await getUser();
    if (!user) {
        return { error: "You must be logged in." };
    }
    
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!newPassword || newPassword.length < 6) {
        return { error: "Password must be at least 6 characters long." };
    }

    if (newPassword !== confirmPassword) {
        return { error: "Passwords do not match." };
    }

    try {
        await adminAuth.updateUser(user.uid, { password: newPassword });
        return { message: "Password updated successfully." };
    } catch (error) {
        console.error("Error updating password:", error);
        return { error: "Failed to update password. Please try again." };
    }
}

export async function updateUserPreferencesAction(prevState: any, formData: FormData): Promise<{ message?: string; error?: string }> {
    const user = await getUser();
    if (!user) {
        return { error: "You must be logged in." };
    }

    const paperlessBilling = formData.get('paperless-billing') === 'on';
    const paymentReminders = formData.get('payment-reminders') === 'on';
    
    const settings: UserSettings = {
        paperlessBilling,
        paymentReminders
    };

    try {
        await updateUserSettingsServer(user.uid, settings);
        revalidatePath('/user/profile');
        return { message: 'Preferences updated successfully.' };
    } catch (error) {
        console.error("Error updating preferences:", error);
        return { error: "Failed to update preferences." };
    }
}

export async function replyToSupportTicketAction(ticketId: string, prevState: any, formData: FormData): Promise<{ message?: string; error?: string }> {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
        return { error: "You do not have permission to perform this action." };
    }

    const reply = formData.get('reply') as string;
    if (!reply) {
        return { error: "Reply message cannot be empty." };
    }
    
    try {
        const ticket = await getSupportTicket(ticketId);
        if (!ticket) {
            return { error: "Ticket not found." };
        }

        await addTicketMessage(ticketId, {
            sender: user.name || 'Admin',
            senderRole: 'admin',
            message: reply,
        });
        
        await createNotification({
            userId: ticket.userId,
            title: `Reply to your ticket: "${ticket.subject}"`,
            message: reply,
            type: 'support',
            isRead: false,
            isArchived: false,
            relatedId: ticketId
        });

        await updateSupportTicket(ticketId, { status: 'in-progress' });
        revalidatePath(`/admin/support/${ticketId}`);
        revalidatePath(`/user/support/${ticketId}`);
        revalidatePath(`/user/notifications`);
        return { message: "Your reply has been sent and the ticket status is now 'in-progress'." };

    } catch (error) {
        console.error("Error replying to ticket:", error);
        return { error: "Failed to send reply." };
    }
}

export async function userReplyToTicketAction(ticketId: string, prevState: any, formData: FormData): Promise<{ message?: string; error?: string }> {
    const user = await getUser();
    if (!user) return { error: "You must be logged in to reply." };

    const reply = formData.get('reply') as string;
    if (!reply) return { error: "Reply message cannot be empty." };

    try {
        await addTicketMessage(ticketId, {
            sender: user.name || 'User',
            senderRole: 'user',
            message: reply,
        });
        await updateSupportTicket(ticketId, { status: 'in-progress' });
        revalidatePath(`/user/support/${ticketId}`);
        revalidatePath(`/admin/support/${ticketId}`);
        return { message: "Your reply has been submitted." };
    } catch (error) {
        console.error("Error submitting user reply:", error);
        return { error: "Failed to submit reply." };
    }
}


export async function closeSupportTicketAction(ticketId: string) {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
        return { error: "You do not have permission to perform this action." };
    }

    try {
        await updateSupportTicket(ticketId, { status: 'closed' });
        revalidatePath(`/admin/support/${ticketId}`);
    } catch (error) {
        console.error("Error closing ticket:", error);
        return { error: "Failed to close the ticket." };
    }
}

export async function reopenSupportTicketAction(ticketId: string) {
    const user = await getUser();
    if (!user) {
        return { error: "You must be logged in to perform this action." };
    }
    
    try {
        await updateSupportTicket(ticketId, { status: 'open' });
        revalidatePath(`/user/support/${ticketId}`);
        revalidatePath(`/admin/support/${ticketId}`);
        revalidatePath(`/admin/support`);
    } catch (error) {
        console.error("Error reopening ticket:", error);
        return { error: "Failed to reopen the ticket." };
    }
}

export async function createPayUTransactionAction(planId: string) {
  const user = await getUser();
  if (!user) {
    return { error: "You must be logged in to create a transaction." };
  }

  const plan = await getPlanServer(planId);
  if (!plan) {
    return { error: "The selected plan does not exist." };
  }
  
  const key = process.env.NEXT_PUBLIC_PAYU_KEY;
  const salt = process.env.NEXT_PUBLIC_PAYU_SALT;

  if (!key || !salt) {
    return { error: "PayU credentials are not configured in the environment." };
  }

  const txnid = `tx-${randomBytes(16).toString("hex")}`;
  const payUData = {
    key: key,
    txnid: txnid,
    amount: plan.price.toString(),
    productinfo: `Subscription to ${plan.name}`,
    firstname: user.name || "Customer",
    email: user.email || "",
    phone: "9999999999", // Placeholder phone number
    surl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback`,
    furl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback`,
    udf1: user.uid,
    udf2: plan.id,
  };

  const hashString = `${key}|${payUData.txnid}|${payUData.amount}|${payUData.productinfo}|${payUData.firstname}|${payUData.email}|${payUData.udf1}|${payUData.udf2}|||||||||${salt}`;
  const hash = sha512(hashString);

  return {
    ...payUData,
    hash: hash,
    payu_url: "https://sandboxsecure.payu.in/_payment", // Sandbox URL, change for production
  };
}

export async function markNotificationAsReadAction(notificationId: string) {
    const user = await getUser();
    if (!user) return { error: "User not found" };
    try {
        await updateNotificationServer(notificationId, { isRead: true });
        revalidatePath('/user/notifications');
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { error: "Failed to mark notification as read." };
    }
}

export async function markAllNotificationsAsReadAction() {
    const user = await getUser();
    if (!user) return { error: "User not found" };
    try {
        await markAllUserNotificationsAsReadServer(user.uid);
        revalidatePath('/user/notifications');
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return { error: "Failed to mark all notifications as read." };
    }
}

export async function archiveNotificationAction(notificationId: string) {
    const user = await getUser();
    if (!user) return { error: "User not found" };
    try {
        await archiveNotificationServer(notificationId);
        revalidatePath('/user/notifications');
    } catch (error) {
        console.error("Error archiving notification:", error);
        return { error: "Failed to archive notification." };
    }
}

export async function archiveAllReadNotificationsAction() {
    const user = await getUser();
    if (!user) return { error: "User not found" };
    try {
        await archiveAllReadUserNotificationsServer(user.uid);
        revalidatePath('/user/notifications');
    } catch (error) {
        console.error("Error archiving all read notifications:", error);
        return { error: "Failed to archive all read notifications." };
    }
}

export async function deleteNotificationAction(notificationId: string) {
    const user = await getUser();
    if (!user) return { error: "User not found" };
    try {
        await deleteNotificationServer(notificationId);
        revalidatePath('/user/notifications');
    } catch (error) {
        console.error("Error deleting notification:", error);
        return { error: "Failed to delete notification." };
    }
}

export async function deleteAllUserNotificationsAction() {
    const user = await getUser();
    if (!user) return { error: "User not found" };
    try {
        await deleteAllUserNotificationsServer(user.uid);
        revalidatePath('/user/notifications');
    } catch (error) {
        console.error("Error deleting all notifications:", error);
        return { error: "Failed to delete all notifications." };
    }
}

export async function deleteAllNotificationsAction() {
     const user = await getUser();
    if (!user || user.role !== 'admin') {
      return { error: "You do not have permission to perform this action." };
    }
    try {
        await deleteAllNotificationsServer();
        revalidatePath('/admin/notifications');
    } catch (error) {
        console.error("Error deleting all notifications:", error);
        return { error: "Failed to delete all notifications." };
    }
}

interface NewUser {
    name: string;
    email: string;
    password?: string;
}

interface BulkCreateResult {
    successCount: number;
    errorCount: number;
    errors: { email: string; reason: string }[];
}


export async function bulkCreateUsersAction(users: NewUser[]): Promise<BulkCreateResult> {
    const adminUser = await getUser();
    if (!adminUser || adminUser.role !== 'admin') {
        return {
            successCount: 0,
            errorCount: users.length,
            errors: users.map(u => ({ email: u.email, reason: 'Permission denied.' }))
        };
    }

    const results: BulkCreateResult = {
        successCount: 0,
        errorCount: 0,
        errors: [],
    };

    for (const user of users) {
        try {
            if (!user.email || !user.name) {
                throw new Error("Missing email or name");
            }
            // Generate a random password if not provided
            const password = user.password || randomBytes(8).toString('hex');
            
            // 1. Create Firebase Auth user
            const userRecord = await adminAuth.createUser({
                email: user.email,
                password: password,
                displayName: user.name,
            });

            // 2. Create Firestore user document
            await createUser(userRecord.uid, user.name, user.email, "user");
            
            results.successCount++;

        } catch (error: any) {
            results.errorCount++;
            results.errors.push({ email: user.email, reason: error.message || "Unknown error" });
            console.error(`Failed to import user ${user.email}:`, error);
        }
    }

    if (results.successCount > 0) {
        revalidatePath("/admin/users");
    }

    return results;
}

    
