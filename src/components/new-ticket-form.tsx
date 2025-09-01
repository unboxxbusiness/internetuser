"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSupportTicketAction } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit Ticket"}
    </Button>
  );
}

export function NewTicketForm() {
  const [state, formAction] = useFormState(createSupportTicketAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="e.g., Internet not working" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="priority">Priority</Label>
        <Select name="priority" required defaultValue="medium">
            <SelectTrigger>
                <SelectValue placeholder="Select a priority" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="low">Low - General question</SelectItem>
                <SelectItem value="medium">Medium - Service issue</SelectItem>
                <SelectItem value="high">High - Service outage</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Please describe the issue in detail..."
          className="min-h-[150px]"
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

      <SubmitButton />
    </form>
  );
}
