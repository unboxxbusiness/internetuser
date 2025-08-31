"use client";

import { useActionState, useFormStatus } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addPlanAction, updatePlanAction } from "@/app/actions";
import { SubscriptionPlan } from "@/lib/types";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Plan" : "Add Plan")}
    </Button>
  );
}

export function PlanForm({ plan }: { plan?: SubscriptionPlan }) {
  const action = plan ? updatePlanAction.bind(null, plan.id) : addPlanAction;
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Plan Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Basic, Premium"
          defaultValue={plan?.name}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Price (USD per month)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            placeholder="e.g., 29.99"
            defaultValue={plan?.price}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="speed">Speed (Mbps)</Label>
          <Input
            id="speed"
            name="speed"
            type="number"
            placeholder="e.g., 100"
            defaultValue={plan?.speed}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dataLimit">Data Limit (GB)</Label>
          <Input
            id="dataLimit"
            name="dataLimit"
            type="number"
            placeholder="e.g., 1000"
            defaultValue={plan?.dataLimit}
            required
          />
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <SubmitButton isEditing={!!plan} />
    </form>
  );
}
