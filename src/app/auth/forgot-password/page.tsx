
"use client";

import { useEffect, useState, useRef } from "react";
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
  const [state, formAction] = useFormState(resetPasswordAction, { error: undefined, message: undefined });
  const [showSuccess, setShowSuccess] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

   useEffect(() => {
    if (state?.message) {
      setShowSuccess(true);
      setClientError(null);
      formRef.current?.reset();
    }
    if (state?.error) {
        setShowSuccess(false);
    }
  }, [state]);

  const handleFormAction = (formData: FormData) => {
    const email = formData.get("email") as string;
    if (!email) {
        setClientError("Please enter an email address.");
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setClientError("Please enter a valid email address.");
        return;
    }
    
    setClientError(null); // Clear client error before submitting
    formAction(formData);
  }

  const handleInputChange = () => {
    if (clientError) setClientError(null);
    if (state?.error) {
        // This won't clear the server state, but good practice for UI state
        // You might need a more complex state management if you want to clear server errors this way
    }
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
                <form ref={formRef} action={handleFormAction} className="grid gap-4" noValidate>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        required
                        onChange={handleInputChange}
                        />
                    </div>
                     {(clientError || state?.error) && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <div className="ml-2 pl-5">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {clientError || state?.error}
                                </AlertDescription>
                            </div>
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
