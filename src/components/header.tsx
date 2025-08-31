import Link from "next/link";
import { Wifi, LogOut } from "lucide-react";
import type { User } from "firebase/auth";
import { logout } from "@/app/auth/actions";
import { Button } from "./ui/button";

interface HeaderProps {
    user: User & { role?: string } | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Wifi className="h-6 w-6 text-primary" />
            Broadband Manager
          </Link>

          {user && (
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <form action={logout}>
                    <Button variant="ghost" size="icon">
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Logout</span>
                    </Button>
                </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
