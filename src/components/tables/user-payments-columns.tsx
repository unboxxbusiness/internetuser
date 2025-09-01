"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/lib/types";
import { DownloadInvoiceButton } from "@/components/download-invoice-button";
import { AppUser } from "@/app/auth/actions";
import { useEffect, useState } from "react";
import { getUser } from "@/app/auth/actions";

const getStatusVariant = (status: "succeeded" | "failed" | "refunded") => {
  switch (status) {
    case "succeeded":
      return "secondary";
    case "failed":
      return "destructive";
    case "refunded":
      return "outline";
    default:
      return "default";
  }
};

const ActionCell = ({ payment }: { payment: Payment }) => {
    const [user, setUser] = useState<AppUser | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getUser();
            setUser(currentUser);
        };
        fetchUser();
    }, []);

    if (!user) return null;

    return <DownloadInvoiceButton payment={payment} user={user} />;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      return <div className="font-mono text-xs">{id.substring(0, 8)}...</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
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
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="text-right">
            <ActionCell payment={payment} />
        </div>
      );
    },
  },
];
