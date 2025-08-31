"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { replyToSupportTicketAction } from "@/app/actions";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending..." : <><Send className="mr-2 h-4 w-4" /> Send Reply</>}
    </Button>
  );
}

export function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const action = replyToSupportTicketAction.bind(null, ticketId);
  const [state, formAction] = useActionState(action, undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message) {
      setShowSuccess(true);
      formRef.current?.reset();
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Respond to Ticket</CardTitle>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="reply" className="sr-only">
              Reply
            </Label>
            <Textarea
              id="reply"
              name="reply"
              placeholder="Type your response here..."
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <SubmitButton />
          {showSuccess && state?.message && (
             <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 w-full">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">Success</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                    {state.message}
                </AlertDescription>
            </Alert>
          )}

          {state?.error && (
            <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {state.error}
                </AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
