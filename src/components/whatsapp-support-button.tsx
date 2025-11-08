
"use client";

import { AppUser } from "@/app/auth/actions";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

interface WhatsAppSupportButtonProps {
    user?: AppUser;
}

export function WhatsAppSupportButton({ user }: WhatsAppSupportButtonProps) {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890"; // Fallback number
    const message = user 
        ? `Hello, I'm ${user.name} (User ID: ${user.uid}) and I need help with my account.`
        : "Hello, I need some help.";

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
