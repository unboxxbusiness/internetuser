import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { getUser } from "./auth/actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Broadband Manager",
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
        <Header user={user} />
        <main>{children}</main>
      </body>
    </html>
  );
}
