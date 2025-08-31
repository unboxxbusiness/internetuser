"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { switchUserPlanAction } from "@/app/actions";
import { Loader2 } from "lucide-react";

export function SwitchPlanButton({ planId, currentPlanId }: { planId: string, currentPlanId?: string }) {
  const [isPending, startTransition] = useTransition();

  const handleSwitch = () => {
    if (confirm("Are you sure you want to switch to this plan?")) {
      startTransition(async () => {
        const result = await switchUserPlanAction(planId);
        if (result.message) {
          alert(result.message);
        } else if (result.error) {
          alert(result.error);
        }
      });
    }
  };

  if (currentPlanId === planId) {
    return (
      <Button disabled className="w-full">
        Current Plan
      </Button>
    );
  }

  return (
    <Button onClick={handleSwitch} disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Switch to Plan
    </Button>
  );
}
