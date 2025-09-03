
"use client"

import * as React from "react"
import { Payment } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/payments-columns";
import { useMediaQuery } from "@/hooks/use-media-query";

export function PaymentTable({ payments }: { payments: Payment[] }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const mobileColumnVisibility = {
    customer: true,
    plan: false,
    status: true,
    amount: true,
    date: false,
    actions: true,
  }

  return (
    <DataTable 
        columns={columns} 
        data={payments} 
        filterColumnId="email"
        filterPlaceholder="Filter by email..."
        initialColumnVisibility={isMobile ? mobileColumnVisibility : {}}
    />
  )
}
