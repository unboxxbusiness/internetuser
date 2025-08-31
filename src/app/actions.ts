"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addCustomer } from "@/lib/firebase/firestore";
import type { Customer } from "@/lib/types";

export async function addCustomerAction(formData: FormData) {
  const customerData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    plan: formData.get("plan") as Customer["plan"],
    paymentStatus: "Paid", // Default status for new customers
    joinDate: new Date().toISOString().split("T")[0],
  };

  await addCustomer(customerData);

  revalidatePath("/");
  redirect("/");
}
