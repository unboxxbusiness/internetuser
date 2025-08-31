
import { redirect } from "next/navigation";
import { getUser } from "@/app/auth/actions";
import { getUserNotifications } from "@/lib/firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, CheckCircle, DollarSign, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification as NotificationType } from "@/lib/types";

function getNotificationIcon(type: NotificationType['type']) {
    switch (type) {
        case 'billing':
            return <DollarSign className="h-5 w-5 text-blue-500" />;
        case 'plan-change':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'warning':
            return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        case 'general':
        default:
            return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
}

function timeAgo(date: Date): string {
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


export default async function UserNotificationsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const notifications = await getUserNotifications(user.uid);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">
          View important updates about your account.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            You have {notifications.length} unread notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border",
                    !notification.isRead && "bg-muted/50"
                  )}
                >
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">
                            {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {timeAgo(notification.createdAt)}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center">
              <Bell className="w-16 h-16 mb-4 text-primary" />
              <p className="text-lg font-medium">No notifications yet.</p>
              <p className="text-sm">
                We'll let you know when there's something new.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
