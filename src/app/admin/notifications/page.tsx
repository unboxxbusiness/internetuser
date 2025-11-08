
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

export default async function AdminNotificationsPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 space-y-4">
       <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Bulk Notifications</h2>
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
    </div>
  );
}
