import { SignOutButton } from "@/components/auth-buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          <CardDescription>Welcome, Admin! This is a protected area for administrators only.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You have full access to all administrative features and settings.</p>
          <div className="mt-6 flex justify-end">
            <SignOutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}