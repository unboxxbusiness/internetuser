
"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface FloatingActionButtonProps {
  href: string;
}

export function FloatingActionButton({ href }: FloatingActionButtonProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return null; // Don't render on desktop
  }

  return (
    <Button asChild className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg z-40">
        <Link href={href}>
            <Plus className="h-6 w-6" />
            <span className="sr-only">Create New</span>
        </Link>
    </Button>
  );
}
