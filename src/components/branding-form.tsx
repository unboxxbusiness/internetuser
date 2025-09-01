"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateBrandingAction } from "@/app/actions";
import { BrandingSettings } from "@/lib/types";
import { DynamicIcon } from "./dynamic-icon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Branding"}
    </Button>
  );
}
export function BrandingForm({ brandingSettings }: { brandingSettings: BrandingSettings | null }) {
  const [state, formAction] = useFormState(updateBrandingAction, undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(brandingSettings?.icon || "Wifi");

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
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input id="brandName" name="brandName" defaultValue={brandingSettings?.brandName || "Gc Fiber Net"} />
            </div>
            <div className="grid gap-2">
            <Label htmlFor="icon">Brand Icon</Label>
             <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                    <DynamicIcon iconName={currentIcon} className="h-6 w-6 text-primary" />
                </div>
                <Input 
                  id="icon" 
                  name="icon" 
                  placeholder="Enter Lucide icon name (e.g., 'Wifi')" 
                  defaultValue={brandingSettings?.icon || "Wifi"}
                  onChange={(e) => setCurrentIcon(e.target.value)}
                />
             </div>
             <p className="text-xs text-muted-foreground">Find icons at lucide.dev</p>
            </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="footerText">Footer Text</Label>
          <Input id="footerText" name="footerText" defaultValue={brandingSettings?.footerText || `© ${new Date().getFullYear()} Gc Fiber Net. All rights reserved.`} />
        </div>
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
