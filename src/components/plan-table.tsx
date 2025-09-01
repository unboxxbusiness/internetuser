"use client"

import { SubscriptionPlan } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/plans-columns";

export function PlanTable({ plans }: { plans: SubscriptionPlan[] }) {
  return (
    <DataTable 
      columns={columns} 
      data={plans}
      filterColumnId="name"
      filterPlaceholder="Filter by plan name..."
    />
  )
}
