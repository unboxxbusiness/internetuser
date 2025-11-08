
"use client"

import { useTransition } from "react"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowUpDown, MoreHorizontal, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Notification } from "@/lib/types"
import { ClientTimeAgo } from "../client-time-ago"
import { deleteNotificationAction } from "@/app/actions"


const ActionsCell = ({ row }: { row: any }) => {
    const [isPending, startTransition] = useTransition();
    const notification = row.original as Notification;

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this notification record? This action cannot be undone.")) {
            startTransition(async () => {
                await deleteNotificationAction(notification.id);
            });
        }
    };

    return (
        <div className="text-right">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/admin/notifications/${notification.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-500 focus:text-red-500"
                    disabled={isPending}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

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
      return <div className="pl-4"><ClientTimeAgo date={row.getValue("sentAt")} /></div>
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
    cell: ActionsCell,
    header: () => <div className="text-right">Actions</div>,
  },
]
