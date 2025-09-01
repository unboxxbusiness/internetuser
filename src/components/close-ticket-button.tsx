
"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { closeSupportTicketAction } from "@/app/actions";
import { Archive } from "lucide-react";

export function CloseTicketButton({ ticketId }: { ticketId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClose = () => {
    if (confirm("Are you sure you want to close this ticket?")) {
      startTransition(async () => {
        const result = await closeSupportTicketAction(ticketId);
        if (result?.error) {
          alert(`Error: ${result.error}`);
        }
      });
    }
  };

  return (
    <Button onClick={handleClose} disabled={isPending} variant="secondary">
        {isPending ? "Closing..." : <><Archive className="mr-2 h-4 w-4" /> Close Ticket</>}
    </Button>
  );
}
