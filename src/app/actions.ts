"use server";

import { revalidatePath } from "next/cache";
import { auth as adminAuth, db } from "@/lib/firebase/server";
import { redirect } from "next/navigation";
import { getUser } from "./auth/actions";
import { updateUser, updateBrandingSettings, createSupportTicket, updateUserSubscription, updateUserSettings, updateSupportTicket, getPlan } from "@/lib/firebase/firestore";
import { BrandingSettings } from "@/lib/types";
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
        // In a real application, you would integrate an email/notification service here.
        // For this example, we'll just log the notification to the console.
        console.log('--- Sending Notification ---');
        console.log('Subject:', subject);
        console.log('Message:', message);
        console.log('--------------------------');
        
        // You could fetch all user emails from Firestore here to send a bulk email.
        // const usersSnapshot = await db.collection('users').get();
        // const emails = usersSnapshot.docs.map(doc => doc.data().email);
        // console.log('Target emails:', emails);
        
        return { message: 'Notification has been successfully sent (logged to console).' };

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
    await updateUser(user.uid, updates);
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
        await updateBrandingSettings(settings);
        revalidatePath('/', 'layout'); // Revalidate the whole site
        return { message: 'Branding settings updated successfully.' };
    } catch (error) {
        console.error('Error updating branding settings:', error);
        return { error: 'Failed to update branding settings.' };
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

    try {
        await createSupportTicket({
            subject,
            description,
            priority,
            userId: user.uid,
            user: {
                name: user.name || 'N/A',
                email: user.email || 'N/A'
            },
            status: 'open',
            lastUpdated: new Date(),
            createdAt: new Date(),
        });
    } catch (error) {
        console.error('Error creating support ticket:', error);
        return { error: 'Failed to create support ticket.' };
    }
    
    revalidatePath('/user/support');
    redirect('/user/support');
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

    try {
        await updateUserSettings(user.uid, { paperlessBilling, paymentReminders });
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
        // In a real app, this would send an email to the user.
        // For now, we log it and update the ticket status.
        console.log(`--- Replying to ticket ${ticketId} ---`);
        console.log(reply);
        console.log('------------------------------------');

        await updateSupportTicket(ticketId, { status: 'in-progress', lastUpdated: new Date() });
        revalidatePath(`/admin/support/${ticketId}`);
        return { message: "Your reply has been sent (logged) and the ticket status is now 'in-progress'." };

    } catch (error) {
        console.error("Error replying to ticket:", error);
        return { error: "Failed to send reply." };
    }
}

export async function createPayUTransactionAction(planId: string) {
  const user = await getUser();
  if (!user) {
    return { error: "You must be logged in to create a transaction." };
  }

  const plan = await getPlan(planId);
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
