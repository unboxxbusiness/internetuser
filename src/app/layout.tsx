
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { getUser } from "./auth/actions";
import { Footer } from "@/components/footer";
import { SidebarProvider, Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { UserSidebar } from "@/components/user-sidebar";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gc Fiber Net",
  description: "Customer management for broadband providers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const cookieStore = cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background text-foreground")}>
        {user ? (
           <SidebarProvider defaultOpen={defaultOpen}>
            {user.role === 'admin' ? <AdminSidebar user={user} /> : <UserSidebar user={user} />}
            <div className="sm:ml-64">
              <Header user={user}>
                 <SidebarTrigger className="sm:hidden" />
              </Header>
              <main className="p-4 sm:p-8 pt-6">{children}</main>
              <Footer />
            </div>
          </SidebarProvider>
        ) : (
          <>
            <Header user={null} />
            <main>{children}</main>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
