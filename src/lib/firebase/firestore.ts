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

export async function getCustomerById(id: string): Promise<Customer> {
    const doc = await db.collection(CUSTOMERS_COLLECTION).doc(id).get();
    if (!doc.exists) {
        throw new Error("Customer not found");
    }
    return { id: doc.id, ...(doc.data() as CustomerData) };
}


export async function addCustomer(customer: CustomerData): Promise<string> {
  const docRef = await db.collection(CUSTOMERS_COLLECTION).add(customer);
  return docRef.id;
}

export async function updateCustomer(id: string, customerData: Partial<CustomerData>): Promise<void> {
    await db.collection(CUSTOMERS_COLLECTION).doc(id).update(customerData);
}

export async function deleteCustomer(id: string): Promise<void> {
    await db.collection(CUSTOMERS_COLLECTION).doc(id).delete();
}
