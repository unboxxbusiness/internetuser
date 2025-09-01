"use client"

import { Payment } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/payments-columns";

export function PaymentTable({ payments }: { payments: Payment[] }) {
  return (
    <DataTable 
        columns={columns} 
        data={payments} 
        filterColumnId="email"
        filterPlaceholder="Filter by email..."
    />
  )
}
