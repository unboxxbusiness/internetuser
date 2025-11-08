
"use server";

import { revalidatePath } from "next/cache";
import { auth as adminAuth, db } from "@/lib/firebase/server";
import { redirect } from "next/navigation";
import { getUser } from "./auth/actions";
import { 
    updateUser as updateUserServer,
    updateBrandingSettings as updateBrandingSettingsServer,
    updateUserSettings as updateUserSettingsServer,
    updateHeroSettings as updateHeroSettingsServer,
    getPlan as getPlanServer,
    getUsers as getUsersServer,
    createUser,
    sendPushNotification,
    deleteNotification as deleteNotificationServer,
    updateNotification as updateNotificationServer,
} from "@/lib/firebase/server-actions";

import { BrandingSettings, HeroSettings, UserSettings, Notification } from "@/lib/types";
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

export async function resetPasswordAction(prevState: any, formData: FormData): Promise<{ message?: string; error?: string }> {
    const email = formData.get('email') as string;
    if (!email) {
        return { error: "Email is required." };
    }
    try {
        const link = await adminAuth.generatePasswordResetLink(email);
        // In a real app, this link would be emailed. The current environment cannot send emails.
        // The link is logged to the server console for demonstration purposes.
        console.log("Password Reset Link (for demonstration):", link);
        return { message: `Password reset instructions have been processed. In a real app, an email would be sent to ${email}.` };
    } catch (error: any) {
        console.error("Error generating password reset link:", error);
        if (error.code === 'auth/user-not-found') {
            return { error: "User with this email does not exist." };
        }
        if (error.code === 'auth/invalid-email') {
            return { error: "Invalid email address format." };
        }
        return { error: "Failed to send password reset email. Please try again later." };
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

export async function updateUserProfileAction(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { error: "You must be logged in to update your profile." };
  }

  const name = formData.get("name") as string;
  const updates: { name?: string, fcmToken?: string | null } = {};

  if (name && name !== user.name) {
    updates.name = name;
  }
  
  // Logic to clear FCM token if notifications are disabled
  // This part would need a UI element, for now we can assume it can be cleared.
  // if (formData.has('disable-notifications')) {
  //   updates.fcmToken = null;
  // }


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
    payu_url: "https://secure.payu.in/_payment", // Production URL
  };
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

export async function sendBulkNotificationAction(prevState: any, formData: FormData): Promise<{ message?: string; error?: string }> {
    const adminUser = await getUser();
    if (!adminUser || adminUser.role !== 'admin') {
        return { error: 'Permission denied.' };
    }

    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!subject || !message) {
        return { error: 'Title and message are required.' };
    }

    try {
        const result = await sendPushNotification(subject, message);
        revalidatePath("/admin/notifications");
        return { message: `Notification sent to ${result.success} subscribers.` };
    } catch (error) {
        console.error("Error sending bulk notification:", error);
        return { error: 'Failed to send notifications.' };
    }
}


export async function deleteNotificationAction(id: string) {
  try {
    await deleteNotificationServer(id);
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { error: "Failed to delete notification." };
  }
  revalidatePath("/admin/notifications");
}

export async function updateNotificationAction(id: string, prevState: any, formData: FormData) {
  try {
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    await updateNotificationServer(id, { subject, message });
  } catch (error) {
    console.error("Error updating notification:", error);
    return { error: "Failed to update notification." };
  }
  revalidatePath("/admin/notifications");
  redirect("/admin/notifications");
}

    