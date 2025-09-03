
"use client"

import * as React from "react"
import { SupportTicket } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/user-support-tickets-columns";
import { useMediaQuery } from "@/hooks/use-media-query";

export function UserSupportTicketTable({ tickets }: { tickets: SupportTicket[] }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const mobileColumnVisibility = {
      subject: true,
      status: true,
      priority: false,
      lastUpdated: true,
      actions: true,
  }
  
  return (
    <DataTable 
        columns={columns} 
        data={tickets}
        filterColumnId="subject"
        filterPlaceholder="Filter by subject..."
        initialColumnVisibility={isMobile ? mobileColumnVisibility : {}}
    />
  );
}
