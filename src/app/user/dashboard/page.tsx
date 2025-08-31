import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";

export default async function UserDashboard() {
  const user = await getUser();
  if (!user || user.role !== 'user') {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your personal dashboard. More features coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
