
"use client";

import { useTransition } from "react";
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
import { Notification } from "@/lib/types";
import { Terminal, Trash2 } from "lucide-react";
import { deleteAllNotificationsAction } from "@/app/actions";

export function NotificationHistory({ notifications }: { notifications: Notification[] }) {
  const [isPending, startTransition] = useTransition();

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
  
  const handleClearHistory = () => {
      if (confirm("Are you sure you want to delete ALL notification history? This action is irreversible.")) {
          startTransition(async () => {
              await deleteAllNotificationsAction();
          });
      }
  }


  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 flex flex-col items-center">
          <Terminal className="w-16 h-16 mb-4" />
          <p className="text-lg font-medium">No notification history yet.</p>
          <p className="text-sm">Once notifications are sent, they will appear here.</p>
        </div>
      ) : (
        <>
        <div className="flex justify-end">
            <Button variant="destructive" size="sm" onClick={handleClearHistory} disabled={isPending}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear All History
            </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-mono text-xs">{notification.userId.substring(0,10)}...</TableCell>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                   <TableCell className="text-muted-foreground">{notification.message.substring(0, 50)}...</TableCell>
                  <TableCell>
                    <Badge variant={notification.isRead ? "secondary" : "default"}>
                      {notification.isRead ? "Read" : "Unread"}
                    </Badge>
                  </TableCell>
                  <TableCell>{timeSince(notification.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </>
      )}
    </div>
  );
}
