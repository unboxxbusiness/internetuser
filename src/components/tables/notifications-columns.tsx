
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Notification } from "@/lib/types"
import { ClientTimeAgo } from "../client-time-ago"

export const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.original.userId.substring(0,10)}...</div>
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.message.substring(0, 50)}...</div>
  },
  {
    accessorKey: "isRead",
    header: "Status",
     cell: ({ row }) => (
      <Badge variant={row.getValue("isRead") ? "secondary" : "default"}>
        {row.getValue("isRead") ? "Read" : "Unread"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Sent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <ClientTimeAgo date={row.getValue("createdAt")} />,
  },
]
