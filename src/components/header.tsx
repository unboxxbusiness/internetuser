import Link from "next/link";
import { Wifi } from "lucide-react";

export function Header() {
  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Wifi className="h-6 w-6 text-primary" />
            Broadband Manager
          </Link>
        </div>
      </div>
    </header>
  );
}
