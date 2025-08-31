"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { createPayUTransactionAction } from "@/app/actions";
import { Loader2 } from "lucide-react";

export function SwitchPlanButton({ planId, currentPlanId }: { planId: string, currentPlanId?: string }) {
  const [isPending, startTransition] = useTransition();

  const handlePayment = (transactionDetails: any) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = transactionDetails.payu_url;
    
    Object.keys(transactionDetails).forEach(key => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = transactionDetails[key];
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleSwitch = () => {
      startTransition(async () => {
        const result = await createPayUTransactionAction(planId);
        if (result.error) {
          alert(`Error: ${result.error}`);
        } else {
          handlePayment(result);
        }
      });
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
        {isPending ? "Redirecting..." : "Switch to Plan"}
    </Button>
  );
}
