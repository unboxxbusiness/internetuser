"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wifi } from "lucide-react";

// In a real app, you would fetch these values from a database
const currentBranding = {
    brandName: "Gc Fiber Net",
    icon: "Wifi",
    footerText: "© 2024 Gc Fiber Net. All rights reserved."
}

export function BrandingForm() {

  // The form submission logic would be handled by a server action
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Branding settings would be saved here.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input id="brandName" name="brandName" defaultValue={currentBranding.brandName} />
            </div>
            <div className="grid gap-2">
            <Label htmlFor="icon">Brand Icon</Label>
             <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                    {/* In a real app, this would dynamically render the selected icon */}
                    <Wifi className="h-6 w-6 text-primary" />
                </div>
                <Input id="icon" name="icon" placeholder="Enter Lucide icon name (e.g., 'Wifi')" defaultValue={currentBranding.icon} />
             </div>
             <p className="text-xs text-muted-foreground">Find icons at lucide.dev</p>
            </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="footerText">Footer Text</Label>
          <Input id="footerText" name="footerText" defaultValue={currentBranding.footerText} />
        </div>
      </div>
      
      <Button type="submit">Save Branding</Button>
    </form>
  );
}
