

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

interface HeaderProps {
  user: AppUser | null;
  branding: BrandingSettings | null;
}

export function Header({ user, branding }: HeaderProps) {
  const dashboardUrl =
    user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const navLinks = [
    { href: "/user/plans", label: "Plans" },
    { href: "/#features", label: "Features" },
    { href: "/user/support", label: "Support" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <DynamicIcon
            iconName={branding?.icon || "Wifi"}
            className="h-6 w-6 text-primary"
          />
          <h2 className="text-xl font-bold tracking-tight">
            {branding?.brandName || "Gc Fiber Net"}
          </h2>
        </Link>
        
        {isDesktop && (
            <nav className="hidden md:flex gap-6 text-sm font-medium">
                {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                        {link.label}
                    </Link>
                ))}
            </nav>
        )}


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
            <>
                <div className="hidden md:flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/auth/login">Log In</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="/auth/signup">Sign Up</Link>
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
                            <div className="absolute top-full right-4 mt-2 w-48 bg-background border rounded-md shadow-lg p-2 flex flex-col gap-1">
                                {navLinks.map(link => (
                                    <Button key={link.href} asChild variant="ghost" className="justify-start">
                                        <Link href={link.href} onClick={() => setIsOpen(false)}>{link.label}</Link>
                                    </Button>
                                ))}
                                <DropdownMenuSeparator />
                                <Button asChild variant="ghost" className="justify-start">
                                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>Log In</Link>
                                </Button>
                                <Button asChild >
                                    <Link href="/auth/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                                </Button>
                            </div>
                        </CollapsibleContent>
                    </div>
                </Collapsible>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
