
"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendBulkNotificationAction, updateNotificationAction } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle } from "lucide-react";
import { Notification } from "@/lib/types";


function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  const text = isEditing ? "Update Record" : "Send Notification to All Users";
  const pendingText = isEditing ? "Updating..." : "Sending...";
  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingText : text}
    </Button>
  );
}

interface NotificationFormProps {
    notification?: Notification;
}

export function NotificationForm({ notification }: NotificationFormProps) {
  const isEditing = !!notification;
  const action = isEditing ? updateNotificationAction.bind(null, notification.id) : sendBulkNotificationAction;
  const [state, formAction] = useFormState(action, undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message || (!state?.error && formRef.current)) {
      setShowSuccess(true);
      if (!isEditing) {
        formRef.current?.reset();
      }
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [state, isEditing]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="subject">Title</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="e.g., Important Service Update"
          defaultValue={notification?.subject}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message Body</Label>
        <Textarea
            id="message"
            name="message"
            placeholder="Compose your message here..."
            className="min-h-[150px]"
            defaultValue={notification?.message}
            required
        />
      </div>

      {showSuccess && (state?.message || isEditing) && (
         <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-300">Success</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">
                {state?.message || "Notification record updated successfully."}
            </AlertDescription>
        </Alert>
      )}

      {state?.error && (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {state.error}
            </AlertDescription>
        </Alert>
      )}

      <SubmitButton isEditing={isEditing} />
    </form>
  );
}
