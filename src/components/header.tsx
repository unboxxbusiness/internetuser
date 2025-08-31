
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, Menu as MenuIcon, X } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { Button } from "./ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppUser } from "@/app/auth/actions";
import { BrandingSettings } from "@/lib/types";
import { DynamicIcon } from "./dynamic-icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Menu, MenuItem, HoveredLink } from "./ui/hover-menu";

interface HeaderProps {
  user: AppUser | null;
  branding: BrandingSettings | null;
}

export function Header({ user, branding }: HeaderProps) {
  const dashboardUrl =
    user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [active, setActive] = useState<string | null>(null);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-3">
          <DynamicIcon
            iconName={branding?.icon || "Wifi"}
            className="h-8 w-8 text-primary"
          />
          <h2 className="text-2xl font-bold tracking-tight">
            {branding?.brandName || "Gc Fiber Net"}
          </h2>
        </Link>
        
        {isDesktop ? (
            <Menu setActive={setActive}>
                <div className="flex items-center space-x-4">
                    <MenuItem setActive={setActive} active={active} item="Plans">
                        <div className="flex flex-col space-y-4 text-sm">
                            <HoveredLink href="/user/plans">All Plans</HoveredLink>
                            <HoveredLink href="/user/plans">Residential</HoveredLink>
                            <HoveredLink href="/user/plans">Business</HoveredLink>
                        </div>
                    </MenuItem>
                    <MenuItem setActive={setActive} active={active} item="Support">
                        <div className="flex flex-col space-y-4 text-sm">
                            <HoveredLink href="/user/support">My Tickets</HoveredLink>
                            <HoveredLink href="/user/support/new">Create Ticket</HoveredLink>
                            <HoveredLink href="#">FAQ</HoveredLink>
                        </div>
                    </MenuItem>
                </div>
            </Menu>
        ) : null}


        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.name || user.email || ""}
                    />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
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
                    <button
                      type="submit"
                      className="w-full text-left flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2">
                    <Button asChild className="font-bold tracking-wide" size="sm">
                        <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                    <Button asChild variant="secondary" className="font-bold tracking-wide bg-slate-200 text-slate-800 hover:bg-slate-300" size="sm">
                        <Link href="/auth/login">Log In</Link>
                    </Button>
                </div>
                <Collapsible asChild open={isOpen} onOpenChange={setIsOpen} className="md:hidden">
                    <div>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" >
                                {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                                <span className="sr-only">Toggle navigation</span>
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent asChild>
                            <div className="absolute top-full right-4 mt-2 w-48 bg-background border rounded-md shadow-lg p-2 flex flex-col gap-2">
                                <Button asChild className="font-bold tracking-wide w-full" size="sm">
                                    <Link href="/auth/signup">Sign Up</Link>
                                </Button>
                                <Button asChild variant="secondary" className="font-bold tracking-wide w-full bg-slate-200 text-slate-800 hover:bg-slate-300" size="sm">
                                    <Link href="/auth/login">Log In</Link>
                                </Button>
                            </div>
                        </CollapsibleContent>
                    </div>
                </Collapsible>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
