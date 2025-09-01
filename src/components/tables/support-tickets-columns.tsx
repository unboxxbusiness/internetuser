"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SupportTicket } from "@/lib/types"

const getStatusVariant = (status: "open" | "in-progress" | "closed") => {
  switch (status) {
    case "open": return "destructive"
    case "in-progress": return "default"
    case "closed": return "secondary"
    default: return "outline"
  }
}

const getPriorityVariant = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low": return "secondary"
    case "medium": return "outline"
    case "high": return "destructive"
    default: return "outline"
  }
}

const timeSince = (date?: Date) => {
    if (!date) return 'N/A'
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

export const columns: ColumnDef<SupportTicket>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
        const user = row.original.user
        return (
            <div>
                <div>{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
        )
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.getValue("status"))}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Badge variant={getPriorityVariant(row.getValue("priority"))}>
        {row.getValue("priority")}
      </Badge>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{timeSince(row.getValue("lastUpdated"))}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <div className="text-right">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/support/${ticket.id}`}>
              <Eye className="mr-2 h-4 w-4" /> View
            </Link>
          </Button>
        </div>
      )
    },
  },
]
