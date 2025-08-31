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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Archive } from "lucide-react";
import { Payment } from "@/lib/types";

export function PaymentTable({ payments }: { payments: Payment[] }) {

  const handleRefund = (paymentId: string) => {
    // In a real app, you would connect this to your payment provider's API
    alert(`Refunding payment ID: ${paymentId}`);
  };

  const getStatusVariant = (status: "succeeded" | "failed" | "refunded") => {
    switch (status) {
      case "succeeded":
        return "default";
      case "failed":
        return "destructive";
      case "refunded":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      {payments.length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
          <p className="text-lg">No payment records found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-medium">{payment.customer}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.email}
                    </div>
                  </TableCell>
                   <TableCell>{payment.plan}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Payment Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuItem
                          onClick={() => handleRefund(payment.id)}
                          disabled={payment.status === 'refunded' || payment.status === 'failed'}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Refund Payment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
