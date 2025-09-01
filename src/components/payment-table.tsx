"use client";

import { Payment } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/payments-columns";

export function PaymentTable({ data }: { data: Payment[] }) {
  return <DataTable columns={columns} data={data} filterColumn="email" filterPlaceholder="Filter by email..."/>;
}
