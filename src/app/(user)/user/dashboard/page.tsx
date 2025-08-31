import { SignOutButton } from "@/components/auth-buttons";

export default function UserDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p className="mt-4">Welcome, User!</p>
      <p>This is your personal dashboard.</p>
      <div className="mt-8">
        <SignOutButton />
      </div>
    </div>
  );
}
