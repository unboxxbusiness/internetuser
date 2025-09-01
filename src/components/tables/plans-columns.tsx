"use client"

import { useTransition } from "react"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SubscriptionPlan } from "@/lib/types"
import { deletePlanAction } from "@/app/actions"

const ActionsCell = ({ row }: { row: any }) => {
    const [isPending, startTransition] = useTransition();
    const plan = row.original as SubscriptionPlan;

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this plan?")) {
            startTransition(async () => {
                await deletePlanAction(plan.id);
            });
        }
    };

    return (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                <Link href={`/admin/plans/${plan.id}/edit`}>
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
    )
}

export const columns: ColumnDef<SubscriptionPlan>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Plan Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
        <div className="text-right">
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}/mo</div>
    },
  },
  {
    accessorKey: "speed",
    header: ({ column }) => (
         <div className="text-center">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Speed
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("speed")} Mbps</div>,
  },
  {
    accessorKey: "dataLimit",
    header: ({ column }) => (
        <div className="text-center">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Data Limit
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("dataLimit")} GB</div>,
  },
  {
    id: "actions",
    cell: ActionsCell,
    header: () => <div className="text-right">Actions</div>,
  },
]
