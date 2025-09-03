
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, LifeBuoy, Settings, Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dock, DockIcon } from './ui/dock';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { logout } from '@/app/auth/actions';

const navigationItems = [
  { href: "/user/dashboard", icon: Home, label: "Home" },
  { href: "/user/plans", icon: LayoutGrid, label: "Plans" },
  { href: "/user/billing", icon: ShoppingCart, label: "Billing" },
  { href: "/user/notifications", icon: Bell, label: "Notifications" },
  { href: "/user/support", icon: LifeBuoy, label: "Support" },
  { href: "/user/profile", icon: Settings, label: "Profile" },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-0 z-50 w-full">
      <TooltipProvider>
        <div className="flex justify-center">
            <Dock>
                {navigationItems.map((item) => (
                    <DockIcon key={item.href}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex h-12 w-12 items-center justify-center rounded-full",
                                        pathname.startsWith(item.href) ? "bg-primary/10 text-primary" : "bg-transparent text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="sr-only">{item.label}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{item.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    </DockIcon>
                ))}
                 <DockIcon>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <form action={logout}>
                                <button
                                    type="submit"
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-transparent text-muted-foreground text-red-500 hover:text-red-500 hover:bg-red-500/10"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="sr-only">Logout</span>
                                </button>
                            </form>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </DockIcon>
            </Dock>
        </div>
      </TooltipProvider>
    </div>
  );
}
