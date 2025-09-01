
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppUser } from "@/app/auth/actions";
import { getUserNotifications as getUserNotificationsServer } from "@/lib/firebase/server-actions";
import {
    markNotificationAsReadAction,
    deleteNotificationAction,
    deleteAllUserNotificationsAction,
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
import { Bell, CheckCircle, DollarSign, AlertTriangle, Trash2, Archive, ArchiveRestore, Loader2, Check, LifeBuoy } from "lucide-react";
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

  const fetchNotifications = async (uid: string) => {
      const userNotifications = await getUserNotificationsServer(uid);
      setNotifications(userNotifications);
  }

  const inboxNotifications = notifications.filter(n => !n.isArchived);
  const archivedNotifications = notifications.filter(n => n.isArchived);
  const unreadCount = inboxNotifications.filter(n => !n.isRead).length;
  const readCount = inboxNotifications.filter(n => n.isRead).length;

  const handleNotificationClick = async (notification: NotificationType) => {
      if (!notification.isRead) {
        await markNotificationAsReadAction(notification.id);
      }
      if (notification.type === 'support' && notification.relatedId) {
          router.push(`/user/support/${notification.relatedId}`);
      }
  };


  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      await markNotificationAsReadAction(id);
      if(user) await fetchNotifications(user.uid);
    });
  };

  const handleArchive = (id: string) => {
    startTransition(async () => {
      await archiveNotificationAction(id);
      if(user) await fetchNotifications(user.uid);
    });
  }

  const handleArchiveAllRead = () => {
      startTransition(async () => {
          await archiveAllReadNotificationsAction();
          if(user) await fetchNotifications(user.uid);
      });
  };
  
  const handleDelete = (id: string) => {
      startTransition(async () => {
          await deleteNotificationAction(id);
          if(user) await fetchNotifications(user.uid);
      });
  };

  const handleDeleteAll = (forArchived: boolean) => {
      const notificationsToDelete = forArchived ? archivedNotifications : inboxNotifications;
      if (confirm(`Are you sure you want to delete all ${forArchived ? 'archived' : 'inbox'} notifications?`)) {
        startTransition(async () => {
          for (const notification of notificationsToDelete) {
            await deleteNotificationAction(notification.id);
          }
          if(user) await fetchNotifications(user.uid);
        });
      }
  };

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
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Inbox</CardTitle>
                        <CardDescription>
                        You have {unreadCount} unread notifications.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleArchiveAllRead} disabled={isPending || readCount === 0}>
                        <Archive className="mr-2 h-4 w-4" /> Archive all read
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteAll(false)} disabled={isPending || inboxNotifications.length === 0}>
                        <Trash2 className="mr-2 h-4 w-4" /> Clear Inbox
                    </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {inboxNotifications.length > 0 ? (
                <div className="space-y-4">
                    {inboxNotifications.map((notification) => (
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
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {!notification.isRead && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} disabled={isPending} title="Mark as read">
                                <Check className="h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => handleArchive(notification.id)} disabled={isPending} title="Archive notification">
                            <Archive className="h-4 w-4" />
                        </Button>
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
                    <p className="text-lg font-medium">Your inbox is empty.</p>
                    <p className="text-sm">
                    We'll let you know when there's something new.
                    </p>
                </div>
                )}
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
                <Button variant="destructive" size="sm" onClick={() => handleDeleteAll(true)} disabled={isPending || archivedNotifications.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear Archive
                </Button>
                </div>
            </CardHeader>
            <CardContent>
                {archivedNotifications.length > 0 ? (
                <div className="space-y-4">
                    {archivedNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50"
                    >
                        <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none text-muted-foreground">
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
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(notification.id)} disabled={isPending} title="Delete notification">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="text-center text-muted-foreground py-12 flex flex-col items-center">
                    <Archive className="w-16 h-16 mb-4 text-primary" />
                    <p className="text-lg font-medium">No archived notifications.</p>
                    <p className="text-sm">
                    You can archive notifications from your inbox.
                    </p>
                </div>
                )}
            </CardContent>
            </Card>
        </TabsContent>
        </Tabs>
  );
}
