import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
          Welcome to Broadband Manager
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          The all-in-one solution for managing your broadband customers, plans, and payments.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="/auth/login">
              Get Started
            </Link>
          </Button>
          <Button variant="ghost" asChild>
             <a href="#">Learn more &rarr;</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
