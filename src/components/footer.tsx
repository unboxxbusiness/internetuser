import Link from "next/link";
import { BrandingSettings } from "@/lib/types";

export function Footer({ branding }: { branding: BrandingSettings | null }) {
  const footerText = branding?.footerText || `© ${new Date().getFullYear()} Gc Fiber Net. All rights reserved.`;
  
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {footerText}
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
