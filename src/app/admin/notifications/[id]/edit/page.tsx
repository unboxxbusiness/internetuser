
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { getNotification } from "@/lib/firebase/server-actions";
import { NotificationForm } from "@/components/notification-form";

export default async function EditNotificationPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const notification = await getNotification(params.id);

  if (!notification) {
    return <div>Notification not found</div>;
  }

  return (
    <div className="flex-1 space-y-4">
       <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Notification</h2>
          <p className="text-muted-foreground">
            Modify the details of a previously sent notification record.
          </p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Editing Notification</CardTitle>
           <CardDescription>
            Note: Editing this entry only changes the historical record. It does not re-send the notification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationForm notification={notification} />
        </CardContent>
      </Card>
    </div>
  );
}
