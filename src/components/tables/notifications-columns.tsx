
"use client"

import { useTransition } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Notification } from "@/lib/types"
import { ClientTimeAgo } from "../client-time-ago"

// This is a placeholder as deleting notifications might not be implemented yet.
// If not, this can be built out later.
const handleDelete = (notificationId: string) => {
    if (confirm("Are you sure you want to delete this notification record? This action cannot be undone.")) {
        // Here you would call a server action, e.g., deleteNotificationAction(notificationId)
        alert(`Deletion for notification ${notificationId} not implemented yet.`);
    }
};

export const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: "sentAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Sent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <ClientTimeAgo date={row.getValue("sentAt")} />
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <div className="font-medium">{row.getValue("subject")}</div>,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => <div className="truncate max-w-sm">{row.getValue("message")}</div>,
  },
   {
    id: "actions",
    cell: ({ row }) => {
      const notification = row.original

      return (
        <div className="text-right">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-500 focus:text-red-500"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
    header: () => <div className="text-right">Actions</div>,
  },
]
