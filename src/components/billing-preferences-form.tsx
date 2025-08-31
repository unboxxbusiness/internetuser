"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateUserPreferencesAction } from "@/app/actions";
import { UserSettings } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Preferences"}
    </Button>
  );
}
export function BillingPreferencesForm({ settings }: { settings: UserSettings | null }) {
  const [state, formAction] = useActionState(updateUserPreferencesAction, undefined);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state?.message) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
       <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="paperless-billing" className="text-base">Paperless Billing</Label>
                <p className="text-sm text-muted-foreground">
                    Receive your bills electronically instead of by mail.
                </p>
            </div>
             <Switch
                id="paperless-billing"
                name="paperless-billing"
                aria-label="Toggle paperless billing"
                defaultChecked={settings?.paperlessBilling}
              />
        </div>
         <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="payment-reminders" className="text-base">Payment Reminders</Label>
                <p className="text-sm text-muted-foreground">
                    Get notified a few days before your payment is due.
                </p>
            </div>
             <Switch
                id="payment-reminders"
                name="payment-reminders"
                defaultChecked={settings?.paymentReminders ?? true}
                aria-label="Toggle payment reminders"
              />
        </div>

        {showSuccess && state?.message && (
         <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-300">Success</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">
                {state.message}
            </AlertDescription>
        </Alert>
      )}

      {state?.error && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {state.error}
            </AlertDescription>
        </Alert>
      )}
      
      <SubmitButton />
    </form>
  );
}
