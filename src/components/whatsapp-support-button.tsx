"use client";

import { AppUser } from "@/app/auth/actions";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

interface WhatsAppSupportButtonProps {
    user?: AppUser;
    isAdmin?: boolean;
}

export function WhatsAppSupportButton({ user, isAdmin = false }: WhatsAppSupportButtonProps) {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890"; // Fallback number
    
    let message = "Hello, I need some help."; // Default for unauthenticated users
    
    if (user && isAdmin) {
        // Message from an admin to a user
        message = `Hello ${user.name}, this is a message from support regarding your account.`;
    } else if (user) {
        // Message from a user to support
        message = `Hello, I'm ${user.name} (User ID: ${user.uid}) and I need help with my account.`;
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <Button asChild size="lg">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat on WhatsApp
            </a>
        </Button>
    );
}
