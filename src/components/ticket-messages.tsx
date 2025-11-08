
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TicketMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ClientTimeAgo } from "./client-time-ago";

function getInitials(name?: string) {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function TicketMessages({ messages }: { messages?: TicketMessage[] }) {
    if (!messages || messages.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Conversation History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {messages.sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()).map((message, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex items-start gap-4",
                            message.senderRole === "admin" && "justify-end"
                        )}
                    >
                        {message.senderRole === "user" && (
                            <Avatar className="w-10 h-10 border">
                                <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={cn(
                                "max-w-md rounded-lg p-3",
                                message.senderRole === 'user' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                            )}
                        >
                            <p className="text-sm font-semibold">{message.sender}</p>
                            <p className="text-sm whitespace-pre-wrap mt-1">{message.message}</p>
                            <p className="text-xs opacity-70 mt-2 text-right">
                               <ClientTimeAgo date={message.timestamp} />
                            </p>
                        </div>
                         {message.senderRole === "admin" && (
                            <Avatar className="w-10 h-10 border">
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
