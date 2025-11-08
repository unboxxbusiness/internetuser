
"use client"

import * as React from "react"
import { Notification } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/notifications-columns";
import { useMediaQuery } from "@/hooks/use-media-query";

export function NotificationHistoryTable({ notifications }: { notifications: Notification[] }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const mobileColumnVisibility = {
    subject: true,
    message: false,
    sentAt: true,
    actions: true,
  }

  return (
    <DataTable 
        columns={columns} 
        data={notifications}
        filterColumnId="subject"
        filterPlaceholder="Filter by subject..."
        initialColumnVisibility={isMobile ? mobileColumnVisibility : {}}
    />
  )
}
