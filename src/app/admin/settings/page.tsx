import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getUser } from "@/app/auth/actions";
import { ThemeToggle } from "@/components/theme-toggle";


export default async function AdminSettingsPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    <p className="text-sm text-muted-foreground">Select a theme for your dashboard.</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Manage your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
                Profile management features will be available here.
            </p>
          </CardContent>
           <CardFooter>
            <Button variant="outline">Update Profile</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>
              Customize your company's branding (whitelabel).
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">
                Branding and whitelabel options will be configured here.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Configure Branding</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
