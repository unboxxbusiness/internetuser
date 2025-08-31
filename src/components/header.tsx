import Link from "next/link";
import { Wifi, LogOut, Search } from "lucide-react";
import type { User } from "firebase/auth";
import { logout } from "@/app/auth/actions";
import { Button } from "./ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "./ui/input";

interface HeaderProps {
  user: (User & { role?: string; name?: string }) | null;
  children?: React.ReactNode;
}

export function Header({ user, children }: HeaderProps) {
  const dashboardUrl =
    user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
           {children || <div />}

          {user ? (
             <div className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9" />
              </div>
            </div>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg"
            >
              <Wifi className="h-6 w-6 text-primary" />
              <span className="hidden sm:inline-block">Gc Fiber Net</span>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.name || user.email || ''} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardUrl}>Dashboard</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="#">Profile</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="#">Billing</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="#">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                   <form action={logout} className="w-full">
                      <button type="submit" className="w-full text-left flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </button>
                    </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
