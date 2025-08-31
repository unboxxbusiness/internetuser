export interface CustomerData {
  name: string;
  email: string;
  plan: "Basic" | "Premium" | "Pro";
  paymentStatus: "Paid" | "Pending" | "Overdue" | "Canceled";
  joinDate: string;
}

export interface Customer extends CustomerData {
  id: string;
}
