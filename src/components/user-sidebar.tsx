
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users,
  ShoppingCart,
  LogOut, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Wifi
} from 'lucide-react';
import { logout, type AppUser } from "@/app/auth/actions";
import { Button } from './ui/button';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface SidebarProps {
  className?: string;
  user: AppUser;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/user/dashboard" },
  { id: "profile", name: "Profile", icon: Users, href: "/user/profile" },
  { id: "billing", name: "Billing", icon: ShoppingCart, href: "/user/billing" },
];

export function UserSidebar({ className = "", user }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (href: string) => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-md border md:hidden hover:bg-accent transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {isOpen ? 
          <X className="h-5 w-5 text-muted-foreground" /> : 
          <Menu className="h-5 w-5 text-muted-foreground" />
        }
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 md:hidden" 
          onClick={toggleSidebar} 
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-card border-r z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-64"}
          md:translate-x-0 md:static md:z-auto
          ${className}
        `}
      >
        <div className={`flex items-center border-b h-16 ${isCollapsed ? 'justify-center' : 'justify-between px-4'}`}>
           <Link href="/" className={`flex items-center gap-2 font-bold text-lg ${isCollapsed ? 'hidden' : ''}`}>
              <Wifi className="h-6 w-6 text-primary" />
              <span className="font-semibold">Gc Fiber Net</span>
           </Link>
            <button
                onClick={toggleCollapse}
                className="hidden md:flex p-1.5 rounded-md hover:bg-accent transition-all duration-200"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                ) : (
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                )}
            </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <li key={item.id}>
                    <Link
                        href={item.href}
                        onClick={() => handleItemClick(item.href)}
                        className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all duration-200 group
                        ${isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }
                        ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? item.name : undefined}
                    >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && (
                            <span className="text-sm">{item.name}</span>
                        )}
                    </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t">
          <div className={`p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {!isCollapsed ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="font-medium text-foreground">{getInitials(user.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            ) : (
                 <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="font-medium text-foreground">{getInitials(user.name)}</span>
                </div>
            )}
          </div>
          <form action={logout} className="w-full">
            <Button
                variant="ghost"
                className={`
                    w-full flex items-center text-left transition-all duration-200 group text-red-500 hover:text-red-500 hover:bg-red-500/10
                    ${isCollapsed ? "justify-center p-3" : "gap-3 p-3 justify-start"}
                `}
                title={isCollapsed ? "Logout" : undefined}
            >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">Logout</span>}
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
