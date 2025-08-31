import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { getPayments } from "@/lib/firebase/firestore";
import { PaymentTable } from "@/components/payment-table";

export default async function AdminPaymentsPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const payments = await getPayments();

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Payment Tracking</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>
            View and manage all payment records from your Firestore database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentTable payments={payments} />
        </CardContent>
      </Card>
    </div>
  );
}
