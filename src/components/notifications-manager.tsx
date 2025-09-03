
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppUser } from "@/app/auth/actions";
import {
    markNotificationAsReadAction,
    deleteNotificationAction,
    archiveNotificationAction,
    archiveAllReadNotificationsAction,
} from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, DollarSign, AlertTriangle, Trash2, Archive, Check, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification as NotificationType } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";


function getNotificationIcon(type: NotificationType['type']) {
    switch (type) {
        case 'billing':
            return <DollarSign className="h-5 w-5 text-blue-500" />;
        case 'plan-change':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'warning':
            return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        case 'support':
            return <LifeBuoy className="h-5 w-5 text-purple-500" />;
        case 'general':
        default:
            return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
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

interface NotificationsManagerProps {
    initialNotifications: NotificationType[];
    user: AppUser;
}

export function NotificationsManager({ initialNotifications, user }: NotificationsManagerProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>(initialNotifications);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleNotificationClick = async (notification: NotificationType) => {
      if (!notification.isRead) {
        await markNotificationAsReadAction(notification.id);
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
      }
      if (notification.type === 'support' && notification.relatedId) {
          router.push(`/user/support/${notification.relatedId}`);
      }
  };

  const handleAction = (action: (id: string) => Promise<any>, id: string) => {
    startTransition(async () => {
        await action(id);
        const res = await fetch(`/api/user/${user.uid}/notifications`);
        const updatedNotifications = await res.json();
        setNotifications(updatedNotifications);
    });
  }

  const handleBulkAction = (action: () => Promise<any>) => {
      startTransition(async () => {
          await action();
          const res = await fetch(`/api/user/${user.uid}/notifications`);
          const updatedNotifications = await res.json();
          setNotifications(updatedNotifications);
      });
  }


  const inboxNotifications = notifications.filter(n => !n.isArchived);
  const archivedNotifications = notifications.filter(n => n.isArchived);
  const unreadCount = inboxNotifications.filter(n => !n.isRead).length;
  const readCount = inboxNotifications.filter(n => n.isRead).length;

  const renderNotificationList = (list: NotificationType[], isArchivedList: boolean) => {
      if (list.length === 0) {
          return (
             <div className="text-center text-muted-foreground py-12 flex flex-col items-center">
                {isArchivedList ? (
                    <>
                        <Archive className="w-16 h-16 mb-4 text-primary" />
                        <p className="text-lg font-medium">No archived notifications.</p>
                        <p className="text-sm">You can archive notifications from your inbox.</p>
                    </>
                ) : (
                    <>
                        <Bell className="w-16 h-16 mb-4 text-primary" />
                        <p className="text-lg font-medium">Your inbox is empty.</p>
                        <p className="text-sm">We'll let you know when there's something new.</p>
                    </>
                )}
            </div>
          )
      }

      return (
        <div className="space-y-4">
            {list.map((notification) => (
            <div
                key={notification.id}
                className={cn(
                "flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50",
                !notification.isRead && "bg-muted/40",
                notification.type === 'support' && 'cursor-pointer'
                )}
                onClick={() => handleNotificationClick(notification)}
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
                <div className="flex items-center gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                {!notification.isRead && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAction(markNotificationAsReadAction, notification.id)} disabled={isPending} title="Mark as read">
                        <Check className="h-4 w-4" />
                    </Button>
                )}
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8" onClick={() => handleAction(archiveNotificationAction, notification.id)} disabled={isPending} title="Archive notification">
                    <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => handleAction(deleteNotificationAction, notification.id)} disabled={isPending} title="Delete notification">
                    <Trash2 className="h-4 w-4" />
                </Button>
                </div>
            </div>
            ))}
        </div>
      )
  }

  return (
    <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList>
            <TabsTrigger value="inbox">
            Inbox <Badge variant="secondary" className="ml-2">{inboxNotifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="archived">
            Archived <Badge variant="secondary" className="ml-2">{archivedNotifications.length}</Badge>
            </TabsTrigger>
        </TabsList>
        <TabsContent value="inbox">
            <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle>Inbox</CardTitle>
                        <CardDescription>
                        You have {unreadCount} unread notifications.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction(archiveAllReadNotificationsAction)} disabled={isPending || readCount === 0}>
                        <Archive className="mr-2 h-4 w-4" /> Archive all read
                    </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {renderNotificationList(inboxNotifications, false)}
            </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="archived">
            <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Archived</CardTitle>
                    <CardDescription>
                    Notifications you have archived.
                    </CardDescription>
                </div>
                </div>
            </CardHeader>
            <CardContent>
                {renderNotificationList(archivedNotifications, true)}
            </CardContent>
            </Card>
        </TabsContent>
        </Tabs>
  );
}
