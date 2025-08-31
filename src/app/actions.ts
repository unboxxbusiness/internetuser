"use server";

import { revalidatePath } from "next/cache";
import { auth as adminAuth, db } from "@/lib/firebase/server";
import { redirect } from "next/navigation";

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

export async function addPlanAction(formData: FormData) {
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

export async function updatePlanAction(id: string, formData: FormData) {
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
