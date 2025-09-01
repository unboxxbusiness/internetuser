
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { getUserPayments } from "@/lib/firebase/server-actions";
import { Payment } from "@/lib/types";
import { columns } from "@/components/tables/user-payments-columns";
import { DataTable } from "@/components/ui/data-table";

export default async function UserBillingPage() {
  const user = await getUser();
  if (!user || user.role !== "user") {
    redirect("/auth/login");
  }

  const paymentHistory: Payment[] = await getUserPayments(user.uid);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">
          View your payment history and download invoices.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>A complete record of your payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={paymentHistory} filterColumn="id" filterPlaceholder="Filter by Invoice ID..." />
        </CardContent>
      </Card>
    </div>
  );
}
