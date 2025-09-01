import { BrandingSettings } from "@/lib/types";

export function Footer({ branding }: { branding: BrandingSettings | null }) {
  const footerText = branding?.footerText || `© ${new Date().getFullYear()} Gc Fiber Net. All rights reserved.`;

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-muted-foreground">
          {footerText}
        </p>
      </div>
    </footer>
  );
}
