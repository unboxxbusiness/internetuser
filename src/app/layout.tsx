
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { getUser } from "./auth/actions";
import { Footer } from "@/components/footer";
import { AdminSidebar } from "@/components/admin-sidebar";
import { UserSidebar } from "@/components/user-sidebar";

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

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <div className="flex min-h-screen">
          {user && (
             <>
              {user.role === 'admin' ? <AdminSidebar user={user} /> : <UserSidebar user={user} />}
             </>
          )}
          <div className="flex-1 flex flex-col">
             <Header user={user} />
             <main className="flex-1 p-4 sm:p-8 pt-6">{children}</main>
             <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
