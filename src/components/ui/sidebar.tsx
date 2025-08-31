// Inspired by: https://dribbble.com/shots/23583228-Sidebar-component-for-an-analytics-dashboard-of-a-fintech-company
"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_COLLAPSE_WIDTH = "4rem"
const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

interface SidebarContextType {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (value: boolean | ((value: boolean) => boolean)) => void
  openMobile: boolean
  setOpenMobile: (value: boolean | ((value: boolean) => boolean)) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === null) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useMediaQuery("(max-width: 640px)")
    const [_open, _setOpen] = React.useState(defaultOpen)
    const [openMobile, setOpenMobile] = React.useState(false)

    const open = openProp ?? _open
    const setOpenProp = onOpenChange ?? _setOpen
    const state = open ? "expanded" : "collapsed"

    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    const toggleSidebar = React.useCallback(() => {
      if (isMobile) {
        setOpenMobile((prev) => !prev)
      } else {
        setOpen((prev) => !prev)
      }
    }, [setOpen, isMobile])

    React.useEffect(() => {
      if (isMobile) {
        setOpen(false)
        setOpenMobile(false)
      }
    }, [isMobile, setOpen])

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          (event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
            (event.metaKey || event.ctrlKey)) ||
          (event.key === "Escape" && openMobile)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      document.addEventListener("keydown", handleKeyDown)
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    }, [toggleSidebar, openMobile])

    return (
      <SidebarContext.Provider
        value={{
          state,
          open,
          setOpen,
          openMobile,
          setOpenMobile,
          isMobile,
          toggleSidebar,
        }}
      >
        <div ref={ref} className={cn("text-sidebar-foreground", className)} {...props}>
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)

SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "icon" | "offcanvas" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { state, open, openMobile, setOpenMobile, isMobile } = useSidebar()
    const x = useMotionValue(0)

    useMotionValueEvent(x, "change", (latest) => {
      if (latest < -10) {
        setOpenMobile(false)
      }
    })

    const Comp = motion.div
    const rootClassName = cn(
      "fixed inset-y-0 z-50 h-full",
      "flex flex-col",
      "bg-sidebar text-sidebar-foreground",
      "transition-all duration-300 ease-in-out",

      // Side
      side === "left" && "left-0",
      side === "right" && "right-0",

      // Variant
      variant === "sidebar" && "border-r",
      variant === "floating" && "m-3 rounded-lg border shadow-lg",
      variant ===_mod.tsx`'use client'

import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
  Wifi,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import type { User } from 'firebase/auth'

export function UserSidebar({ user }: { user: User & { role?: string; name?: string } }) {
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
              isActive={isActive('/user/dashboard')}
            >
              <Link href="/user/dashboard">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/user/profile')}
            >
              <Link href="#">
                <Users />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/user/billing')}
            >
              <Link href="#">
                <ShoppingCart />
                <span>Billing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
`"inset" && "m-3 rounded-lg border shadow-lg",

      // Collapsible
      isMobile && collapsible === "offcanvas" ? "w-[var(--sidebar-width-mobile)]" : "w-[var(--sidebar-width)]",
      collapsible === "icon" &&
        state === "collapsed" &&
        "w-[var(--sidebar-collapse-width)]",
      className
    )

    const mobileClassName = cn(
      "fixed inset-y-0 z-50 h-full",
      "flex flex-col",
      "bg-sidebar text-sidebar-foreground",
      "transition-all duration-300 ease-in-out",
      "w-[var(--sidebar-width-mobile)]",
      "border-r",

      // Side
      side === "left" ? "left-0" : "right-0",

      className
    )

    if (isMobile) {
      return (
        <>
          <AnimatePresence>
            {openMobile && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="fixed inset-0 z-40 bg-black/50"
                  onClick={() => setOpenMobile(false)}
                />
                <Comp
                  ref={ref}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  style={{ x }}
                  initial={{ x: side === "left" ? "-100%" : "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: side === "left" ? "-100%" : "100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={mobileClassName}
                  data-collapsible={collapsible}
                  data-state={state}
                  data-side={side}
                  data-variant={variant}
                  {...props}
                >
                  {children}
                </Comp>
              </>
            )}
          </AnimatePresence>
        </>
      )
    }

    return (
      <Comp
        ref={ref}
        className={rootClassName}
        data-collapsible={collapsible}
        data-state={state}
        data-side={side}
        data-variant={variant}
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
            "--sidebar-collapse-width": SIDEBAR_COLLAPSE_WIDTH,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Sidebar.displayName = "Sidebar"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-in-out",
        open ? "sm:ml-64" : "sm:ml-16",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

SidebarInset.displayName = "SidebarInset"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-16 shrink-0 items-center justify-between",
        "border-b px-3",
        className
      )}
      {...props}
    />
  )
})

SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto", className)}
      {...props}
    />
  )
})

SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-auto flex flex-col", "border-t", className)}
      {...props}
    />
  )
})

SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("group/group flex flex-col p-3", className)}
      {...props}
    />
  )
})

SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
  }
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center",
        "px-2 py-1.5 text-sm font-semibold",
        "text-sidebar-foreground/70",
        className
      )}
      {...props}
    />
  )
})

SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "ml-auto hidden size-6",
        "items-center justify-center",
        "rounded-md text-sidebar-foreground/70",
        "hover:bg-sidebar-accent",
        "group-hover/group:flex",
        className
      )}
      {...props}
    />
  )
})

SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  )
})

SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  )
})

SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "group/menu-item relative flex items-center",
        state === "collapsed" && "justify-center",
        className
      )}
      {...props}
    />
  )
})

SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive?: boolean
    asChild?: boolean
  }
>(({ className, isActive, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <button
      ref={ref}
      className={cn(
        "peer/menu-button flex w-full items-center",
        "gap-3 rounded-md px-2.5 py-1.5",
        "text-left text-sm font-medium",
        "transition-colors duration-200 ease-in-out",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
        isActive &&
          "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",

        // Collapsed
        state === "collapsed" && "w-10 justify-center p-2.5",
        state === "collapsed" && "[&_span]:hidden",
        className
      )}
      data-active={isActive}
      {...props}
    />
  )
})

SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  if (state === "collapsed") {
    return null
  }
  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2",
        "hidden size-6 items-center justify-center",
        "rounded-md text-sidebar-foreground/70",
        "opacity-0 transition-opacity duration-200 ease-in-out",
        "hover:bg-sidebar-accent",
        "group-hover/menu-item:opacity-100",
        "peer-data-[active=true]/menu-button:opacity-100",
        "group-focus-visible/menu-item:opacity-100",
        className
      )}
      {...props}
    />
  )
})

SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  if (state === "collapsed") {
    return null
  }
  return (
    <div
      ref={ref}
      className={cn("ml-auto text-xs font-semibold", className)}
      {...props}
    />
  )
})

SidebarMenuBadge.displayName = "SidebarMenuBadge"

function SidebarMenuSub({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar()
  if (state === "collapsed") {
    return null
  }
  return (
    <div className="relative ml-5 before:absolute before:-left-1 before:h-full before:w-px before:bg-sidebar-border">
      <div className="flex flex-col gap-0.5 pl-3">{children}</div>
    </div>
  )
}

const SidebarMenuSubItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("group/sub-item relative", className)}
      {...props}
    />
  )
})

SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive?: boolean
    asChild?: boolean
  }
>(({ className, isActive, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "peer/sub-button flex w-full items-center",
        "gap-3 rounded-md px-2.5 py-1.5",
        "text-left text-sm",
        "transition-colors duration-200 ease-in-out",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        className
      )}
      data-active={isActive}
      {...props}
    />
  )
})

SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { showIcon?: boolean }
>(({ className, showIcon, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 px-2.5 py-1.5", className)}
      {...props}
    >
      {showIcon && <div className="size-4 shrink-0 rounded-sm bg-muted/60" />}
      <div
        className={cn(
          "h-4 w-full rounded-sm bg-muted/60",
          state === "collapsed" && "hidden"
        )}
      />
    </div>
  )
})

SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => {
  return (
    <hr
      ref={ref}
      className={cn("my-2 border-sidebar-border", className)}
      {...props}
    />
  )
})

SidebarSeparator.displayName = "SidebarSeparator"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      ref={ref}
      className={cn(
        "size-9",
        "flex items-center justify-center",
        "rounded-md text-sidebar-foreground/70",
        "hover:bg-sidebar-accent",
        className
      )}
      onClick={() => toggleSidebar()}
      {...props}
    >
      <span className="sr-only">Toggle Sidebar</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M14 6l-6 6l6 6" />
      </svg>
    </button>
  )
})

SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { open, toggleSidebar } = useSidebar()
  return (
    <button
      ref={ref}
      className={cn(
        "absolute -right-2 top-1/2 -translate-y-1/2",
        "flex size-8 items-center justify-center",
        "rounded-full border bg-sidebar text-sidebar-foreground",
        "transition-all duration-300 ease-in-out",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
        !open && "rotate-180",
        className
      )}
      onClick={() => toggleSidebar()}
      {...props}
    >
      <span className="sr-only">Toggle Sidebar</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="M14 6l-6 6l6 6" />
      </svg>
    </button>
  )
})

SidebarRail.displayName = "SidebarRail"

export {
  useSidebar,
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuSkeleton,
  SidebarSeparator,
  SidebarTrigger,
  SidebarRail,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
}
