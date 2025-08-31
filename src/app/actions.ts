"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addCustomer, updateCustomer, deleteCustomer } from "@/lib/firebase/firestore";
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
