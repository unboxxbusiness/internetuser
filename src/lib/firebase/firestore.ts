
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
export async function createUser(uid: string, name:string, email: string, role: string, photoURL?: string): Promise<void> {
  await db.collection(USERS_COLLECTION).doc(uid).set({
    uid,
    name,
    email,
    role,
    photoURL,
  });
}

export async function getUser(uid: string): Promise<{uid:string; name:string; email:string; role:string; photoURL?:string} | null> {
  const doc = await db.collection(USERS_COLLECTION).doc(uid).get();
  if (!doc.exists) {
    return null;
  }
  const data = doc.data()
  return {
    uid: data?.uid,
    name: data?.name,
    email: data?.email,
    role: data?.role,
    photoURL: data?.photoURL,
  }
}
