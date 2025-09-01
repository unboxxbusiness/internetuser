
"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SupportTicket } from "@/lib/types";
import { Eye } from "lucide-react";

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
};

export function SupportTicketTable({ tickets }: { tickets: SupportTicket[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
             <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                    No support tickets found.
                </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.subject}</TableCell>
                <TableCell>
                    <div>{ticket.user.name}</div>
                    <div className="text-sm text-muted-foreground">{ticket.user.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityVariant(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>{timeSince(new Date(ticket.lastUpdated))}</TableCell>
                <TableCell className="text-right">
                   <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/support/${ticket.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                    </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
