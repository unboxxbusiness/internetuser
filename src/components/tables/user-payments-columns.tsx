"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Payment } from "@/lib/types"
import { AppUser } from "@/app/auth/actions"
import { DownloadInvoiceButton } from "../download-invoice-button"

const getStatusVariant = (status: "succeeded" | "failed" | "refunded") => {
  switch (status) {
    case "succeeded": return "secondary"
    case "failed": return "destructive"
    case "refunded": return "outline"
    default: return "default"
  }
}

export const getUserPaymentsColumns = (user: AppUser): ColumnDef<Payment>[] => [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("id").substring(0, 8)}...</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
  },
   {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.getValue("status"))}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <DownloadInvoiceButton payment={row.original} user={user} />
      </div>
    ),
  },
]
