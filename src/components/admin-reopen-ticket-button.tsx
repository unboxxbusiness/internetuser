
"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { adminReopenSupportTicketAction } from "@/app/actions";
import { RotateCcw } from "lucide-react";

export function AdminReopenTicketButton({ ticketId }: { ticketId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleReopen = () => {
      startTransition(async () => {
        const result = await adminReopenSupportTicketAction(ticketId);
        if (result?.error) {
          alert(`Error: ${result.error}`);
        }
      });
  };

  return (
    <Button onClick={handleReopen} disabled={isPending} variant="outline">
        {isPending ? "Re-opening..." : <><RotateCcw className="mr-2 h-4 w-4" /> Re-open Ticket</>}
    </Button>
  );
}

    