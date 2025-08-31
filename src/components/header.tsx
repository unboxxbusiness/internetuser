import Link from "next/link";
import { Wifi, LogOut } from "lucide-react";
import type { User } from "firebase/auth";
import { logout } from "@/app/auth/actions";
import { Button } from "./ui/button";

interface HeaderProps {
  user: (User & { role?: string }) | null;
}

export function Header({ user }: HeaderProps) {
  const dashboardUrl = user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href={user ? dashboardUrl : "/"}
            className="flex items-center gap-2 font-bold text-lg"
          >
            <Wifi className="h-6 w-6 text-primary" />
            Gc Fiber Net
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href={dashboardUrl}>Dashboard</Link>
              </Button>
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {user.email}
              </span>
              <form action={logout}>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
