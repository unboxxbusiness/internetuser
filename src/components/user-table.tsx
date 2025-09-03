
"use client"

import * as React from "react"
import { AppUser } from "@/app/auth/actions";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/users-columns";
import { useMediaQuery } from "@/hooks/use-media-query";

export function UserTable({ users }: { users: AppUser[] }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const mobileColumnVisibility = {
      email: false,
      role: true,
      accountStatus: false,
      paymentStatus: true,
      actions: true,
  }

  return (
    <DataTable 
        columns={columns} 
        data={users}
        filterColumnId="email"
        filterPlaceholder="Filter by email..."
        initialColumnVisibility={isMobile ? mobileColumnVisibility : {}}
    />
  )
}
