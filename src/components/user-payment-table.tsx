
"use client"

import * as React from "react"
import { Payment } from "@/lib/types";
import { AppUser } from "@/app/auth/actions";
import { DataTable } from "@/components/ui/data-table";
import { getUserPaymentsColumns } from "@/components/tables/user-payments-columns";
import { useMediaQuery } from "@/hooks/use-media-query";

export function UserPaymentTable({ payments, user }: { payments: Payment[], user: AppUser }) {
  const columns = getUserPaymentsColumns(user);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const mobileColumnVisibility = {
      id: false,
      date: true,
      plan: true,
      amount: true,
      status: false,
      actions: true,
  }


  return (
    <DataTable 
        columns={columns} 
        data={payments}
        filterColumnId="plan"
        filterPlaceholder="Filter by plan..."
        initialColumnVisibility={isMobile ? mobileColumnVisibility : {}}
    />
  )
}
