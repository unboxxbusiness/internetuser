
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SupportTicket } from "@/lib/types"
import { ClientTimeAgo } from "../client-time-ago"

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

export const columns: ColumnDef<SupportTicket>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
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
    cell: ({ row }) => <ClientTimeAgo date={row.getValue("lastUpdated")} />,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <div className="text-right">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/user/support/${ticket.id}`}>
              <Eye className="mr-2 h-4 w-4" /> View
            </Link>
          </Button>
        </div>
      )
    },
  },
]
