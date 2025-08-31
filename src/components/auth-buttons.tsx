"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/auth/login");
  };

  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
