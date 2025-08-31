import { db } from "./server";
import type { Customer, CustomerData } from "@/lib/types";

const CUSTOMERS_COLLECTION = "customers";

export async function getCustomers(): Promise<Customer[]> {
  const snapshot = await db.collection(CUSTOMERS_COLLECTION).orderBy("joinDate", "desc").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as CustomerData),
  }));
}

export async function addCustomer(customer: CustomerData): Promise<string> {
  const docRef = await db.collection(CUSTOMERS_COLLECTION).add(customer);
  return docRef.id;
}
