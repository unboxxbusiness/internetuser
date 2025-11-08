
"use client";

import { AppUser } from "@/app/auth/actions";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";

interface WhatsAppSupportButtonProps {
    user?: AppUser;
}

export function WhatsAppSupportButton({ user }: WhatsAppSupportButtonProps) {
    const pathname = usePathname();
    const isAdminPath = pathname.startsWith('/admin');
    
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890"; // Fallback number
    
    let message = "Hello, I need some help."; // Default for users
    
    if (user && isAdminPath) {
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
