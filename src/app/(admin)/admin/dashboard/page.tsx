import { SignOutButton } from "@/components/auth-buttons";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">Welcome, Admin!</p>
      <p>This is a protected area for administrators only.</p>
       <div className="mt-8">
        <SignOutButton />
      </div>
    </div>
  );
}
