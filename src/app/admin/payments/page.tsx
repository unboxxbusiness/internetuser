import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { PaymentTable } from "@/components/payment-table";

export default async function AdminPaymentsPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  // In a real application, you would fetch these from your database
  const payments = [
      { id: "1", customer: "John Doe", email: "john.doe@example.com", plan: "Premium", status: "succeeded", amount: 99.99, date: new Date() },
      { id: "2", customer: "Jane Smith", email: "jane.smith@example.com", plan: "Basic", status: "succeeded", amount: 29.99, date: new Date(new Date().setDate(new Date().getDate() - 1)) },
      { id: "3", customer: "Michael Johnson", email: "michael.j@example.com", plan: "Premium", status: "failed", amount: 99.99, date: new Date(new Date().setDate(new Date().getDate() - 1)) },
      { id: "4", customer: "Emily Davis", email: "emily.d@example.com", plan: "Standard", status: "refunded", amount: 59.99, date: new Date(new Date().setDate(new Date().getDate() - 2)) },
      { id: "5", customer: "Chris Lee", email: "chris.l@example.com", plan: "Basic", status: "succeeded", amount: 29.99, date: new Date(new Date().setDate(new Date().getDate() - 3)) },
  ];

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Payment Tracking</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>
            View and manage all payment records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentTable payments={payments} />
        </CardContent>
      </Card>
    </div>
  );
}
