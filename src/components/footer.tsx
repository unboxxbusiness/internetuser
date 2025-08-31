import Link from "next/link";
import { Wifi } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Gc Fiber Net. All rights reserved.
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
