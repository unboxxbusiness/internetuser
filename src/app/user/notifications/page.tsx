
import { redirect } from "next/navigation";
import { getUser } from "@/app/auth/actions";
import { getUserNotifications } from "@/lib/firebase/server-actions";
import { NotificationsManager } from "@/components/notifications-manager";

export default async function UserNotificationsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const initialNotifications = await getUserNotifications(user.uid);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">
          View important updates about your account.
        </p>
      </div>
      <NotificationsManager initialNotifications={initialNotifications} user={user} />
    </div>
  );
}
