import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { getPlan } from "@/lib/firebase/firestore";
import { PlanForm } from "@/components/plan-form";

export default async function EditPlanPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const plan = await getPlan(params.id);

  if (!plan) {
    return <div>Plan not found</div>;
  }

  return (
    <div className="flex-1 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanForm plan={plan} />
        </CardContent>
      </Card>
    </div>
  );
}
