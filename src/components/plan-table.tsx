"use client";

import { SubscriptionPlan } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/plans-columns";

export function PlanTable({ data }: { data: SubscriptionPlan[] }) {
  return <DataTable columns={columns} data={data} filterColumn="name" filterPlaceholder="Filter by name..."/>;
}
