"use client"

import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
  Wifi,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { User } from "firebase/auth"

export function AdminSidebar({ user }: { user: User & { role?: string; name?: string } }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Sidebar collapsible="icon" className="hidden sm:flex">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Wifi className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Gc Fiber Net</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/admin/dashboard")}
            >
              <Link href="/admin/dashboard">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/admin/customers")}
            >
              <Link href="#">
                <Users />
                <span>Customers</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
