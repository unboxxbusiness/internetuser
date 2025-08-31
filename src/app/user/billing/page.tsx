
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUser } from "@/app/auth/actions";
import { Download } from "lucide-react";

export default async function UserBillingPage() {
  const user = await getUser();
  if (!user || user.role !== "user") {
    redirect("/auth/login");
  }

  // --- Placeholder Data ---
  const paymentHistory = [
    { id: "INV-001", date: "June 30, 2024", amount: 79.99, status: "succeeded" },
    { id: "INV-002", date: "May 30, 2024", amount: 79.99, status: "succeeded" },
    { id: "INV-003", date: "April 30, 2024", amount: 79.99, status: "succeeded" },
    { id: "INV-004", date: "March 30, 2024", amount: 79.99, status: "succeeded" },
    { id: "INV-005", date: "February 29, 2024", amount: 79.99, status: "succeeded" },
    { id: "INV-006", date: "January 30, 2024", amount: 79.99, status: "succeeded" },
  ];
  // --- End Placeholder Data ---

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">View your payment history and download invoices.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>A complete record of your payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "succeeded" ? "secondary" : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
