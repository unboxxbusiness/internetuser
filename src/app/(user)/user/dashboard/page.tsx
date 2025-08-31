import { SignOutButton } from "@/components/auth-buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function UserDashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
       <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">User Dashboard</CardTitle>
          <CardDescription>Welcome to your personal dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is your personal space. Enjoy the features available to you!</p>
          <div className="mt-6 flex justify-end">
            <SignOutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}