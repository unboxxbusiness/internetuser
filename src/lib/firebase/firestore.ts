import { db } from "./server";
import type { Customer, CustomerData } from "@/lib/types";

const CUSTOMERS_COLLECTION = "customers";
const USERS_COLLECTION = "users";

// Customer Functions
export async function getCustomers(): Promise<Customer[]> {
  const snapshot = await db.collection(CUSTOMERS_COLLECTION).orderBy("joinDate", "desc").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as CustomerData),
  }));
}

export async function getCustomerById(id: string): Promise<Customer | null> {
    const doc = await db.collection(CUSTOMERS_COLLECTION).doc(id).get();
    if (!doc.exists) {
        return null;
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

// User & Role Functions
export async function createUser(uid: string, email: string, role: string): Promise<void> {
  await db.collection(USERS_COLLECTION).doc(uid).set({
    uid,
    email,
    role,
  });
}

export async function getUserRole(uid: string): Promise<string | null> {
  const doc = await db.collection(USERS_COLLECTION).doc(uid).get();
  if (!doc.exists) {
    return null;
  }
  return (doc.data()?.role as string) || null;
}
