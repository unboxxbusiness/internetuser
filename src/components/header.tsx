import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
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
import type { AppUser } from "@/app/auth/actions";
import { BrandingSettings } from "@/lib/types";
import { DynamicIcon } from "./dynamic-icon";

interface HeaderProps {
  user: AppUser | null;
  branding: BrandingSettings | null;
}

export function Header({ user, branding }: HeaderProps) {
  const dashboardUrl =
    user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <DynamicIcon iconName={branding?.icon || "Wifi"} className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {branding?.brandName || "Gc Fiber Net"}
            </h2>
          </Link>
        </div>

        {user ? (
            <div className="flex items-center gap-4">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
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
            </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Button asChild className="font-bold tracking-wide" size="sm">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
              <Button asChild variant="secondary" className="hidden sm:flex font-bold tracking-wide bg-slate-200 text-slate-800 hover:bg-slate-300" size="sm">
                <Link href="/auth/login">Log In</Link>
              </Button>
               <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
