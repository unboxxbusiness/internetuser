
import { BrandingSettings } from "@/lib/types";

export function Footer({ branding }: { branding: BrandingSettings | null }) {
  const footerText = branding?.footerText || `© ${new Date().getFullYear()} Gc Fiber Net. All rights reserved.`;

  return (
    <footer className="bg-card border-t py-6">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-center md:text-left text-sm text-muted-foreground">
          {footerText}
        </p>
      </div>
    </footer>
  );
}
