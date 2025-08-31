export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: "Basic" | "Premium" | "Pro";
  paymentStatus: "Paid" | "Pending" | "Overdue";
  joinDate: string;
}

export const placeholderCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    plan: "Premium",
    paymentStatus: "Paid",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    plan: "Basic",
    paymentStatus: "Pending",
    joinDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    plan: "Pro",
    paymentStatus: "Paid",
    joinDate: "2023-03-10",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    plan: "Pro",
    paymentStatus: "Overdue",
    joinDate: "2023-04-05",
  },
  {
    id: "5",
    name: "Chris Lee",
    email: "chris.lee@example.com",
    plan: "Basic",
    paymentStatus: "Paid",
    joinDate: "2023-05-21",
  },
];
