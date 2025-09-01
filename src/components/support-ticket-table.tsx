"use client";

import { SupportTicket } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/support-tickets-columns";

export function SupportTicketTable({ data }: { data: SupportTicket[] }) {
  return <DataTable columns={columns} data={data} filterColumn="subject" filterPlaceholder="Filter by subject..."/>;
}
