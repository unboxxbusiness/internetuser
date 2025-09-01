"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Archive, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "customer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const payment = row.original;
        return (
            <div>
                <div className="font-medium">{payment.customer}</div>
                <div className="text-sm text-muted-foreground">{payment.email}</div>
            </div>
        )
    }
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.getValue("status"))}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
   {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return date.toLocaleDateString();
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      const handleRefund = (paymentId: string) => {
          // In a real app, you would connect this to your payment provider's API
          alert(`Refunding payment ID: ${paymentId}`);
      };

      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
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
        </div>
      );
    },
  },
];
