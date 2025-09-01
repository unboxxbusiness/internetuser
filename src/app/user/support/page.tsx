
"use client";

import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Loader2 } from "lucide-react";
import { getUser, AppUser } from "@/app/auth/actions";
import { getUserSupportTickets } from "@/lib/firebase/client-actions";
import { UserSupportTicketTable } from "@/components/user-support-ticket-table";
import { useEffect, useState } from "react";
import { SupportTicket } from "@/lib/types";

export default function UserSupportPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const currentUser = await getUser();
      if (!currentUser) {
        redirect("/auth/login");
      }
      setUser(currentUser);
      const userTickets = await getUserSupportTickets(currentUser.uid);
      setTickets(userTickets);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Support Tickets</h2>
          <p className="text-muted-foreground">
            Track and manage your support requests.
          </p>
        </div>
        <Button asChild>
          <Link href="/user/support/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Ticket
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket History</CardTitle>
          <CardDescription>A list of your past and current support tickets.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : (
              <UserSupportTicketTable tickets={tickets} />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
