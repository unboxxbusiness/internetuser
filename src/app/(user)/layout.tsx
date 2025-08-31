import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';

export const metadata: Metadata = {
  title: 'User Dashboard',
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}
