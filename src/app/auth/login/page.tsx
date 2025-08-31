"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (res.ok) {
        const { role } = await res.json();
        if (role === 'admin') {
          window.location.assign("/admin/dashboard");
        } else {
          window.location.assign("/user/dashboard");
        }
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create session");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="mb-4 text-center text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
         <div className="mt-4 text-center text-sm">
          <p>Admin: admin@example.com / password</p>
          <p>User: user@example.com / password</p>
           <p className="font-bold mt-2">Note: You need to create these users in Firebase Auth and set a custom claim `role: 'admin'` for the admin user.</p>
        </div>
        <div className="mt-4 text-center text-sm">
            <p>Don&apos;t have an account? <Link href="/auth/signup" className="font-medium text-primary hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
