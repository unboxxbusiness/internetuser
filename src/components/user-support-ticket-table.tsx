"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SupportTicket } from "@/lib/types";
import { LifeBuoy } from "lucide-react";

export function UserSupportTicketTable({ tickets }: { tickets: SupportTicket[] }) {

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
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }


  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 flex flex-col items-center">
          <LifeBuoy className="w-16 h-16 mb-4 text-primary" />
          <p className="text-lg font-medium">No support tickets found.</p>
          <p className="text-sm">Click "Create New Ticket" to get started.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.subject}</TableCell>
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
                  <TableCell>{timeSince(ticket.lastUpdated)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
