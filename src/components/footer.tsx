
import { BrandingSettings } from "@/lib/types";

export function Footer({ branding }: { branding: BrandingSettings | null }) {
  const footerText = branding?.footerText || `© ${new Date().getFullYear()} Gc Fiber Net. All rights reserved.`;

  return (
    <footer className="bg-card border-t py-6">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">
          {footerText}
        </p>
      </div>
    </footer>
  );
}
