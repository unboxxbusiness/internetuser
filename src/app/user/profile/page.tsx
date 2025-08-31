
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser, AppUser } from "@/app/auth/actions";
import { ProfileForm } from "@/components/profile-form";
import { PasswordForm } from "@/components/password-form";

export default async function UserProfilePage() {
  const user = await getUser();
  if (!user || user.role !== "user") {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* The existing ProfileForm can be reused here */}
            <ProfileForm user={user} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              For your security, we recommend choosing a strong password.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
