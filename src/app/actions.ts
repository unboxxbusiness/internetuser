"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addCustomer, updateCustomer, deleteCustomer } from "@/lib/firebase/firestore";
import { auth as adminAuth } from "@/lib/firebase/server";
import { db } from "@/lib/firebase/server";
import type { Customer, CustomerData } from "@/lib/types";

export async function addCustomerAction(formData: FormData) {
  const customerData: CustomerData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    plan: formData.get("plan") as Customer["plan"],
    paymentStatus: "Paid", // Default status for new customers
    joinDate: new Date().toISOString().split("T")[0],
  };

  await addCustomer(customerData);

  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function updateCustomerAction(id: string, formData: FormData) {
    const customerData: Omit<CustomerData, 'joinDate'> = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        plan: formData.get("plan") as Customer["plan"],
        paymentStatus: formData.get("paymentStatus") as Customer["paymentStatus"],
    };

    await updateCustomer(id, customerData);

    revalidatePath("/admin/dashboard");
    revalidatePath(`/customers/${id}/edit`);
    redirect("/admin/dashboard");
}

export async function deleteCustomerAction(id: string) {
    await deleteCustomer(id);
    revalidatePath("/admin/dashboard");
}

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