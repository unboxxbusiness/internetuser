
"use client";

import * as React from "react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/lib/types";
import { Terminal, Trash2 } from "lucide-react";
import { deleteAllNotificationsAction } from "@/app/actions";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/tables/notifications-columns";
import { useMediaQuery } from "@/hooks/use-media-query";


export function NotificationHistory({ notifications }: { notifications: Notification[] }) {
  const [isPending, startTransition] = useTransition();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const handleClearHistory = () => {
      if (confirm("Are you sure you want to delete ALL notification history? This action is irreversible.")) {
          startTransition(async () => {
              await deleteAllNotificationsAction();
          });
      }
  }

  const mobileColumnVisibility = {
    userId: false,
    title: true,
    message: true,
    status: false,
    sent: true,
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
        <DataTable
            columns={columns}
            data={notifications}
            filterColumnId="title"
            filterPlaceholder="Filter by title..."
            initialColumnVisibility={isMobile ? mobileColumnVisibility : {}}
        />
        </>
      )}
    </div>
  );
}
