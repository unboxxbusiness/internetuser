"use client"

import { Payment } from "@/lib/types";
import { AppUser } from "@/app/auth/actions";
import { DataTable } from "@/components/ui/data-table";
import { getUserPaymentsColumns } from "@/components/tables/user-payments-columns";

export function UserPaymentTable({ payments, user }: { payments: Payment[], user: AppUser }) {
  const columns = getUserPaymentsColumns(user);
  return (
    <DataTable 
        columns={columns} 
        data={payments}
        filterColumnId="plan"
        filterPlaceholder="Filter by plan..."
    />
  )
}
