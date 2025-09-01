"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubscriptionPlan } from "@/lib/types";
import { deletePlanAction } from "@/app/actions";


export const columns: ColumnDef<SubscriptionPlan>[] = [
  {
    accessorKey: "name",
    header: "Plan Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return `${formatted}/mo`;
    },
  },
  {
    accessorKey: "speed",
    header: "Speed",
    cell: ({ row }) => `${row.getValue("speed")} Mbps`,
  },
  {
    accessorKey: "dataLimit",
    header: "Data Limit",
    cell: ({ row }) => `${row.getValue("dataLimit")} GB`,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const plan = row.original;
      const [isPending, startTransition] = useTransition();

      const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this plan?")) {
          startTransition(async () => {
            const result = await deletePlanAction(id);
            if (result?.error) {
              alert(result.error);
            }
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
                <Link href={`/admin/plans/${plan.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(plan.id)}
                className="text-red-500 focus:text-red-500"
                disabled={isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
