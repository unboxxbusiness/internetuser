
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Notification } from "@/lib/types"

const timeSince = (date?: Date) => {
    if (!date) return 'N/A';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) return `${Math.floor(interval)} years ago`
    interval = seconds / 2592000
    if (interval > 1) return `${Math.floor(interval)} months ago`
    interval = seconds / 86400
    if (interval > 1) return `${Math.floor(interval)} days ago`
    interval = seconds / 3600
    if (interval > 1) return `${Math.floor(interval)} hours ago`
    interval = seconds / 60
    if (interval > 1) return `${Math.floor(interval)} minutes ago`
    return `${Math.floor(seconds)} seconds ago`
}

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
    cell: ({ row }) => <div>{timeSince(row.getValue("createdAt"))}</div>,
  },
]
