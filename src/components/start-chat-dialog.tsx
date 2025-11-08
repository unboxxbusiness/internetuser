
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquarePlus, Loader2, AlertCircle } from "lucide-react";
import { adminCreateTicketAction } from "@/app/actions";
import type { AppUser } from "@/app/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "Starting Chat..." : "Start Chat"}
    </Button>
  );
}

interface StartChatDialogProps {
  admin: AppUser;
  targetUser: AppUser;
}

export function StartChatDialog({ admin, targetUser }: StartChatDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useFormState(adminCreateTicketAction, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.ticketId) {
      // Redirect to the new ticket page upon successful creation
      router.push(`/admin/support/${state.ticketId}`);
    }
  }, [state, router]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <MessageSquarePlus className="mr-2 h-4 w-4" /> Start Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new chat with {targetUser.name}</DialogTitle>
          <DialogDescription>
            This will create a new support ticket and send a notification to the user.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4 py-4">
           {/* Hidden fields to pass user data */}
           <input type="hidden" name="targetUserId" value={targetUser.uid} />
           <input type="hidden" name="targetUserName" value={targetUser.name || ""} />
           <input type="hidden" name="targetUserEmail" value={targetUser.email || ""} />

          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" placeholder="e.g., A question about your account" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder={`Hi ${targetUser.name}, I'm contacting you because...`}
              className="min-h-[120px]"
              required
            />
          </div>
          
           {state?.error && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
             <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
             <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
