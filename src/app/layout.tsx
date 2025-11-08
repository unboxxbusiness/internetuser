
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getUser } from "./auth/actions";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { getBrandingSettings } from "@/lib/firebase/server-actions";
import { UserLayout } from "@/components/user-layout";
import { PushNotificationProvider } from "@/components/push-notification-provider";


const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getBrandingSettings();
  return {
    title: branding?.brandName || "Gc Fiber Net",
    description: "Customer management for broadband providers",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const branding = await getBrandingSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PushNotificationProvider user={user}>
            <div className="flex min-h-screen">
              {user ? (
                <>
                  {user.role === 'admin' ? (
                      <>
                          <AdminSidebar user={user} branding={branding} />
                          <div className="flex-1 flex flex-col">
                              <main className="flex-1 p-4 sm:p-8 pt-6">{children}</main>
                              <Footer branding={branding} />
                          </div>
                      </>
                  ) : (
                      <UserLayout user={user} branding={branding}>
                          {children}
                      </UserLayout>
                  )}
                </>
              ) : (
                 <div className="flex-1 flex flex-col">
                    <Header user={user} branding={branding} />
                    <main className="flex-1">{children}</main>
                    <Footer branding={branding} />
                 </div>
              )}
            </div>
          </PushNotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
