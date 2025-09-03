
"use client"

import * as React from "react"
import { SubscriptionPlan } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/plans-columns";
import { useMediaQuery } from "@/hooks/use-media-query";

export function PlanTable({ plans }: { plans: SubscriptionPlan[] }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const mobileColumnVisibility = {
    name: true,
    price: true,
    speed: false,
    dataLimit: false,
    actions: true,
  }

  return (
    <DataTable 
      columns={columns} 
      data={plans}
      filterColumnId="name"
      filterPlaceholder="Filter by plan name..."
      initialColumnVisibility={isMobile ? mobileColumnVisibility : {}}
    />
  )
}
