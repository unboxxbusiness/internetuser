"use client";

import type { AppUser } from "@/app/auth/actions";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/users-columns";

export function UserTable({ data }: { data: AppUser[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="email"
      filterPlaceholder="Filter by email..."
    />
  );
}
