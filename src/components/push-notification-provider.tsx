
"use client";

import { useEffect } from 'react';
import { requestNotificationPermission } from '@/lib/firebase/client';
import { usePathname } from 'next/navigation';
import { AppUser } from '@/app/auth/actions';

interface PushNotificationProviderProps {
    user: AppUser | null;
    children: React.ReactNode;
}

const AUTH_PAGES = ['/auth/login', '/auth/signup'];

export function PushNotificationProvider({ user, children }: PushNotificationProviderProps) {
    const pathname = usePathname();

    useEffect(() => {
        if (user && typeof window !== 'undefined' && 'serviceWorker' in navigator && !AUTH_PAGES.includes(pathname)) {
            // Delay to allow Firebase to initialize fully
            setTimeout(() => {
                requestNotificationPermission(user.uid);
            }, 3000);
        }
    }, [user, pathname]);

    return <>{children}</>;
}
