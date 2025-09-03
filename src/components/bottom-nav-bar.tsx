
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, LifeBuoy, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { href: "/user/dashboard", icon: Home, label: "Home" },
  { href: "/user/plans", icon: LayoutGrid, label: "Plans" },
  { href: "/user/billing", icon: ShoppingCart, label: "Billing" },
  { href: "/user/support", icon: LifeBuoy, label: "Support" },
  { href: "/user/profile", icon: Settings, label: "Profile" },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
