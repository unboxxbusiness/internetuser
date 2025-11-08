
"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { resetPasswordAction } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Sending..." : "Send Reset Link"}
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(resetPasswordAction, undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

   useEffect(() => {
    if (state?.message) {
      setShowSuccess(true);
    }
  }, [state]);

  const handleFormAction = (formData: FormData) => {
    const email = formData.get("email") as string;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setClientError("Please enter a valid email address.");
        return;
    }
    setClientError(null);
    formAction(formData);
  }

  return (
     <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] w-full">
      <div className="w-full max-w-sm">
         <Button variant="ghost" asChild className="mb-4">
          <Link href="/auth/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we will send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showSuccess ? (
                 <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-800 dark:text-green-300">Email Sent</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-400">
                        {state?.message}
                    </AlertDescription>
                </Alert>
            ) : (
                <form action={handleFormAction} className="grid gap-4" noValidate>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        required
                        />
                    </div>
                     {(clientError || state?.error) && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {clientError || state?.error}
                            </AlertDescription>
                        </Alert>
                    )}
                    <SubmitButton />
                </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
