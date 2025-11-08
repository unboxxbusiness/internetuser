
"use client";

import { useState, useEffect } from 'react';

// Helper to convert various date formats to a Date object
function toDate(date: any): Date | null {
    if (!date) return null;
    if (date instanceof Date) return date;
    // Handle Firestore Timestamps
    if (typeof date === 'object' && date.seconds && date.nanoseconds) {
        return new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    }
    // Handle string representations
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
        return d;
    }
    return null;
}


function timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    if (seconds < 10) return "just now";
    return Math.floor(seconds) + " seconds ago";
}

interface ClientTimeAgoProps {
    date: any;
}

export function ClientTimeAgo({ date }: ClientTimeAgoProps) {
    const [displayTime, setDisplayTime] = useState<string>('');
    const [clientDate, setClientDate] = useState<Date | null>(null);

    // Set the date object only on the client side to avoid hydration mismatch
    useEffect(() => {
        const d = toDate(date);
        if (d) {
            setClientDate(d);
            setDisplayTime(timeAgo(d)); // Set initial time
        } else {
            setDisplayTime('N/A');
        }
    }, [date]);


    if (!clientDate) {
        // Render nothing or a placeholder on the server and initial client render
        return <span>...</span>;
    }

    // Render the client-side calculated time
    return <span title={clientDate.toLocaleString()}>{displayTime}</span>
}
