
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/lib/types";
import { AppUser } from "@/app/auth/actions";
import { DownloadInvoiceButton } from "./download-invoice-button";

const getStatusVariant = (status: "succeeded" | "failed" | "refunded") => {
  switch (status) {
    case "succeeded":
      return "secondary";
    case "failed":
      return "destructive";
    case "refunded":
      return "outline";
    default:
      return "default";
  }
};

export function UserPaymentTable({ payments, user }: { payments: Payment[], user: AppUser }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-xs">{payment.id.substring(0,8)}...</TableCell>
                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(payment.amount)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(payment.status)}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DownloadInvoiceButton payment={payment} user={user} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
