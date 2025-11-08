
"use client";

import { useState, useEffect } from 'react';

function timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
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


export function ClientTimeAgo({ date }: { date?: Date }) {
    const [displayTime, setDisplayTime] = useState('N/A');

    useEffect(() => {
        if (date) {
            setDisplayTime(timeAgo(date));
        }
    }, [date]);

    if (!date) {
        return <span>N/A</span>;
    }

    // Render the server-generated date string first, then update on client mount
    return <span title={new Date(date).toLocaleString()}>{displayTime}</span>
}
