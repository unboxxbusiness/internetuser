"use client";

import Link from "next/link";
import { Wifi } from "lucide-react";
import { useAuth } from "./auth-provider";
import { auth } from "@/lib/firebase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      const response = await fetch("/api/auth/session", { method: "DELETE" });
      if (response.ok) {
        router.push("/auth/login");
      } else {
        console.error("Failed to logout session");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Wifi className="h-6 w-6 text-primary" />
            Broadband Manager
          </Link>
          <nav>
            {!loading &&
              (user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
