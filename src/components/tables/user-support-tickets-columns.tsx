"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { SupportTicket } from "@/lib/types";

const getStatusVariant = (status: "open" | "in-progress" | "closed") => {
  switch (status) {
    case "open":
      return "destructive";
    case "in-progress":
      return "default";
    case "closed":
      return "secondary";
    default:
      return "outline";
  }
};

const getPriorityVariant = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return "secondary";
    case "medium":
      return "outline";
    case "high":
      return "destructive";
    default:
      return "outline";
  }
};

const timeSince = (date?: Date) => {
    if (!date) return 'N/A';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }


export const columns: ColumnDef<SupportTicket>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
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
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <Badge variant={getPriorityVariant(row.getValue("priority"))}>
        {row.getValue("priority")}
      </Badge>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
     cell: ({ row }) => timeSince(new Date(row.getValue("lastUpdated"))),
  },
];
