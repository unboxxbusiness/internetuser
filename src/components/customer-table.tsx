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
import { MoreHorizontal } from "lucide-react";
import type { Customer } from "@/lib/placeholder-data";

type StatusVariant = "default" | "secondary" | "destructive" | "outline";

const statusVariantMap: Record<Customer["paymentStatus"], StatusVariant> = {
  Paid: "default",
  Pending: "secondary",
  Overdue: "destructive",
};

export function CustomerTable({ customers }: { customers: Customer[] }) {
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
              <div className="text-sm text-muted-foreground">{customer.email}</div>
            </TableCell>
            <TableCell>{customer.plan}</TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[customer.paymentStatus]}>
                {customer.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>{customer.joinDate}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
