
"use client"

import * as React from "react"
import { SupportTicket } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/support-tickets-columns";
import { useMediaQuery } from "@/hooks/use-media-query";

export function SupportTicketTable({ tickets }: { tickets: SupportTicket[] }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const mobileColumnVisibility = {
      subject: true,
      user: false,
      status: true,
      priority: false,
      lastUpdated: true,
      actions: true,
  }

  return (
     <DataTable 
        columns={columns} 
        data={tickets}
        filterColumnId="user"
        filterPlaceholder="Filter by user name..."
        initialColumnVisibility={isMobile ? mobileColumnVisibility : {}}
     />
  )
}
