import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser } from "@/app/auth/actions";
import { NotificationForm } from "@/components/notification-form";
import { AlertCircle, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default async function AdminNotificationsPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Notifications & Alerts</h2>
      </div>
      <Tabs defaultValue="bulk">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bulk">Bulk Notifications</TabsTrigger>
          <TabsTrigger value="automated">Automated Alerts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="bulk">
            <Card>
                <CardHeader>
                <CardTitle>Send a Bulk Notification</CardTitle>
                <CardDescription>
                    Compose and send a message to all registered users. This is useful for announcements, promotions, or service updates.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <NotificationForm />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="automated">
            <Card>
                <CardHeader>
                <CardTitle>Automated Alerts</CardTitle>
                <CardDescription>
                    These notifications are typically triggered automatically based on system events. (Configuration required).
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Payment Failure Notifications</AlertTitle>
                        <AlertDescription>
                            These are sent to users when a recurring payment fails. This would require integration with a payment provider like Stripe to trigger a webhook.
                        </AlertDescription>
                    </Alert>
                     <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Subscription Expiry Reminders</AlertTitle>
                        <AlertDescription>
                            These are sent to users a few days before their subscription plan is set to expire. This requires a scheduled task (cron job) on the server to check for upcoming expirations daily.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="history">
            <Card>
                <CardHeader>
                <CardTitle>Notification History</CardTitle>
                <CardDescription>
                    A log of all sent notifications would be displayed here.
                </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
                    <Terminal className="w-16 h-16 mb-4" />
                    <p className="text-lg font-medium">No notification history yet.</p>
                    <p className="text-sm">Once notifications are sent, they will appear here.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
