
"use client";

import React, { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { UserSidebar } from "./user-sidebar";
import { Footer } from "./footer";
import { AppUser } from "@/app/auth/actions";
import { BrandingSettings } from "@/lib/types";
import { BottomNavBar } from "./bottom-nav-bar";

interface UserLayoutProps {
  children: React.ReactNode;
  user: AppUser;
  branding: BrandingSettings | null;
}

export function UserLayout({ user, branding, children }: UserLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <>
        <UserSidebar user={user} branding={branding} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 sm:p-8 pt-6">{children}</main>
        </div>
      </>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-4 pt-6 pb-24">{children}</main>
      <BottomNavBar />
    </div>
  );
}
