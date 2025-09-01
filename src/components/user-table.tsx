"use client"

import { AppUser } from "@/app/auth/actions";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/users-columns";

export function UserTable({ users }: { users: AppUser[] }) {
  return (
    <DataTable 
        columns={columns} 
        data={users}
        filterColumnId="email"
        filterPlaceholder="Filter by email..."
    />
  )
}
