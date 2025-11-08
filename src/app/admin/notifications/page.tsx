
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { NotificationForm } from "@/components/notification-form";
import { getNotifications } from "@/lib/firebase/server-actions";
import { NotificationHistoryTable } from "@/components/notification-history-table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function NotificationHistory() {
    const notifications = await getNotifications();
    return <NotificationHistoryTable notifications={notifications} />
}

function NotificationHistorySkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <div className="rounded-md border">
                <Skeleton className="h-[200px] w-full" />
            </div>
        </div>
    )
}

export default async function AdminNotificationsPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 space-y-8">
       <div>
          <h2 className="text-3xl font-bold tracking-tight">Bulk Notifications</h2>
          <p className="text-muted-foreground">
            Send messages to all of your subscribers.
          </p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Send a Push Notification</CardTitle>
                <CardDescription>
                    Compose a message to be sent to all users who have enabled notifications.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <NotificationForm />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Notification History</CardTitle>
                <CardDescription>
                    A log of all push notifications previously sent.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Suspense fallback={<NotificationHistorySkeleton />}>
                    <NotificationHistory />
                </Suspense>
            </CardContent>
        </Card>
    </div>
  );
}
