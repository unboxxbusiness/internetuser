
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/app/auth/actions";
import { getPlans } from "@/lib/firebase/server-actions";
import { PlanTable } from "@/components/plan-table";
import { PlusCircle } from "lucide-react";

export default async function AdminPlansPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const plans = await getPlans();

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Plan Management</h2>
        <Button asChild>
          <Link href="/admin/plans/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Plan
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanTable plans={plans} />
        </CardContent>
      </Card>
    </div>
  );
}
