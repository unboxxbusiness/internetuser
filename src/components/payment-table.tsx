
"use client";

import Link from "next/link";
import { useTransition } from "react";
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
import { MoreHorizontal, Archive, User, Eye, Trash2 } from "lucide-react";
import { Payment } from "@/lib/types";

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

export function PaymentTable({ payments }: { payments: Payment[] }) {
  const [isPending, startTransition] = useTransition();

  const handleRefund = (paymentId: string) => {
    // In a real app, you would connect this to your payment provider's API
    if (confirm("This is a demo action. Are you sure you want to simulate refunding this payment?")) {
        startTransition(() => {
            alert(`Simulating refund for payment ID: ${paymentId}. In a real app, this would trigger a refund via your payment gateway.`);
        });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
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
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(payment.amount)}
                </TableCell>
                <TableCell>
                  {new Date(payment.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem asChild>
                            <Link href={`/admin/users/${payment.userId}`}>
                                <User className="mr-2 h-4 w-4" />
                                View User
                            </Link>
                        </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRefund(payment.id)}
                        disabled={payment.status === 'refunded' || payment.status === 'failed' || isPending}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Refund Payment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
