
"use client";

import { useEffect, useState, useTransition } from "react";
import { redirect } from "next/navigation";
import { getUser, AppUser } from "@/app/auth/actions";
import { getUserNotifications as getUserNotificationsServer } from "@/lib/firebase/server-actions";
import {
    markNotificationAsReadAction,
    deleteNotificationAction,
    markAllNotificationsAsReadAction,
    deleteAllUserNotificationsAction,
} from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, DollarSign, AlertTriangle, Trash2, MailCheck, Loader2, Check } from "lucide-react";
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

export default function UserNotificationsPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchNotifications = async (uid: string) => {
      const userNotifications = await getUserNotificationsServer(uid);
      setNotifications(userNotifications);
  }

  useEffect(() => {
    async function fetchData() {
      const currentUser = await getUser();
      if (!currentUser) {
        redirect("/auth/login");
        return;
      }
      setUser(currentUser);
      await fetchNotifications(currentUser.uid);
      setIsLoading(false);
    }
    fetchData();
  }, []);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      await markNotificationAsReadAction(id);
      if(user) await fetchNotifications(user.uid);
    });
  };
  
  const handleDelete = (id: string) => {
      startTransition(async () => {
          await deleteNotificationAction(id);
          if(user) await fetchNotifications(user.uid);
      });
  };

  const handleMarkAllAsRead = () => {
      startTransition(async () => {
          await markAllNotificationsAsReadAction();
          if(user) await fetchNotifications(user.uid);
      });
  };

  const handleDeleteAll = () => {
      if (confirm("Are you sure you want to delete all notifications?")) {
        startTransition(async () => {
            await deleteAllUserNotificationsAction();
            if(user) await fetchNotifications(user.uid);
        });
      }
  };


  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }
  
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
          <div className="flex items-center justify-between">
              <div>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>
                    You have {unreadCount} unread notifications.
                  </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={isPending || unreadCount === 0}>
                    <MailCheck className="mr-2 h-4 w-4" /> Mark all as read
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteAll} disabled={isPending || notifications.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear all
                </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50",
                    !notification.isRead && "bg-muted/40"
                  )}
                >
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <p className={cn("text-sm font-medium leading-none", !notification.isRead && "font-bold")}>
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
                   <div className="flex items-center gap-2">
                    {!notification.isRead && (
                        <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} disabled={isPending} title="Mark as read">
                           <Check className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(notification.id)} disabled={isPending} title="Delete notification">
                        <Trash2 className="h-4 w-4" />
                    </Button>
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
