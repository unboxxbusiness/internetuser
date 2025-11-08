
"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { reopenSupportTicketAction } from "@/app/actions";
import { RotateCcw } from "lucide-react";

export function ReopenTicketButton({ ticketId }: { ticketId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleReopen = () => {
      startTransition(async () => {
        const result = await reopenSupportTicketAction(ticketId);
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

    