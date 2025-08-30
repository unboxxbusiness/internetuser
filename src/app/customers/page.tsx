import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { customers, availablePlans } from "@/lib/data";
import type { Customer } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function CustomersPage() {
  const getPlanName = (planId: string | null) => {
    return availablePlans.find(p => p.id === planId)?.planName || 'N/A';
  };

  const getCustomerStatus = (customer: Customer) => {
    if (customer.paymentHistory.some(p => p.status === 'overdue')) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (customer.paymentHistory.some(p => p.status === 'pending')) {
      return <Badge variant="secondary">Pending</Badge>;
    }
    return <Badge variant="outline">Active</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your customers and their service plans.</CardDescription>
        </div>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Customer
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map(customer => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="font-medium">{customer.name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {customer.email}
                  </div>
                </TableCell>
                <TableCell>{getCustomerStatus(customer)}</TableCell>
                <TableCell>{getPlanName(customer.planId)}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(customer.joinedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/customers/${customer.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
