
"use client";

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
import { getUser, AppUser } from "@/app/auth/actions";
import { getUserPayments } from "@/lib/firebase/client-actions";
import { DownloadInvoiceButton } from "@/components/download-invoice-button";
import { useEffect, useState } from "react";
import { Payment } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function UserBillingPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const currentUser = await getUser();
      if (!currentUser || currentUser.role !== "user") {
        redirect("/auth/login");
      }
      setUser(currentUser);
      const payments = await getUserPayments(currentUser.uid);
      setPaymentHistory(payments);
      setIsLoading(false);
    }
    fetchData();
  }, []);

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
          {isLoading ? (
            <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : paymentHistory.length > 0 ? (
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
                    <TableCell className="font-medium">{payment.id.substring(0,8)}...</TableCell>
                    <TableCell>{payment.date.toLocaleDateString()}</TableCell>
                    <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
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
                       {user && <DownloadInvoiceButton payment={payment} user={user} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center text-muted-foreground py-12">
                <p>No payment history found.</p>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
