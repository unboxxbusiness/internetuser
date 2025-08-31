import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}
