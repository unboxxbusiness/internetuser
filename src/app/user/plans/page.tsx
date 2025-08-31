
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { getPlans, getUserSubscription } from "@/lib/firebase/firestore";
import { CheckCircle } from "lucide-react";
import { SwitchPlanButton } from "@/components/switch-plan-button";

export default async function UserPlansPage() {
  const user = await getUser();
  if (!user || user.role !== "user") {
    redirect("/auth/login");
  }

  const [plans, currentSubscription] = await Promise.all([
    getPlans(),
    getUserSubscription(user.uid),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Subscription Plans</h2>
        <p className="text-muted-foreground">
          Choose the plan that's right for you.
        </p>
      </div>

      {plans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col ${
                currentSubscription?.planId === plan.id
                  ? "border-primary ring-2 ring-primary"
                  : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold">
                    ${plan.price.toFixed(2)}
                  </span>
                  /month
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Up to {plan.speed} Mbps speed
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    {plan.dataLimit} GB data limit
                  </li>
                   <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    24/7 customer support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                 <SwitchPlanButton 
                    planId={plan.id} 
                    currentPlanId={currentSubscription?.planId}
                 />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12">
          <p>No subscription plans are available at the moment.</p>
        </div>
      )}
    </div>
  );
}
