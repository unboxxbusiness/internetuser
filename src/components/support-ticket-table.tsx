"use client"

import { SupportTicket } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/support-tickets-columns";

export function SupportTicketTable({ tickets }: { tickets: SupportTicket[] }) {
  return (
     <DataTable 
        columns={columns} 
        data={tickets}
        filterColumnId="subject"
        filterPlaceholder="Filter by subject..."
     />
  )
}
