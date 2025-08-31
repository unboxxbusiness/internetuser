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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Customer } from "@/lib/types";
import Link from "next/link";
import { deleteCustomerAction } from "@/app/actions";
import { useTransition } from "react";

type StatusVariant = "default" | "secondary" | "destructive" | "outline";

const statusVariantMap: Record<Customer["paymentStatus"], StatusVariant> = {
  Paid: "default",
  Pending: "secondary",
  Overdue: "destructive",
  Canceled: "outline",
};

export function CustomerTable({ customers }: { customers: Customer[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      startTransition(() => {
        deleteCustomerAction(id);
      });
    }
  };

  if (customers.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16">
        <p className="text-lg">No customers found.</p>
        <p className="mt-2">
          Click the "Add Customer" button to get started.
        </p>
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Join Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <div className="font-medium">{customer.name}</div>
              <div className="text-sm text-muted-foreground">
                {customer.email}
              </div>
            </TableCell>
            <TableCell>{customer.plan}</TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[customer.paymentStatus]}>
                {customer.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>{customer.joinDate}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isPending}>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Customer Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/customers/${customer.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-500 focus:text-red-500"
                    disabled={isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
