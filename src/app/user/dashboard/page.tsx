import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";

export default async function UserDashboard() {
  const user = await getUser();
  if (!user || user.role !== "user") {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.name || "User"}!</CardTitle>
            <CardDescription>
              This is your personal dashboard. More features coming soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You can view your account details and manage your subscription
              here in the future.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
