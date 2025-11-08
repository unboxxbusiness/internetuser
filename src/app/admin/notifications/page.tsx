
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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default async function AdminNotificationsPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Push Notifications</h2>
      </div>
        <Card>
            <CardHeader>
            <CardTitle>Send a Push Notification</CardTitle>
            <CardDescription>
                Compose and send a message to all registered users who have enabled notifications.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <NotificationForm />
            </CardContent>
        </Card>
         <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>How It Works</AlertTitle>
            <AlertDescription>
                This system uses Firebase Cloud Messaging (FCM) to send push notifications directly to users' devices (desktops and mobile phones). Users must first grant permission in their browser to receive these alerts. Notifications will appear even if the user does not have the app open.
            </AlertDescription>
        </Alert>
    </div>
  );
}
