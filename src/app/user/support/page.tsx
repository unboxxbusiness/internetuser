
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
import { PlusCircle } from "lucide-react";
import { getUser } from "@/app/auth/actions";
import { getUserSupportTickets } from "@/lib/firebase/server-actions";
import { UserSupportTicketTable } from "@/components/user-support-ticket-table";
import { SupportTicket } from "@/lib/types";
import { FloatingActionButton } from "@/components/floating-action-button";

export default async function UserSupportPage() {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }
  
  const tickets: SupportTicket[] = await getUserSupportTickets(user.uid);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Support Tickets</h2>
          <p className="text-muted-foreground">
            Track and manage your support requests.
          </p>
        </div>
        <Button asChild className="hidden sm:inline-flex">
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
            <UserSupportTicketTable tickets={tickets} />
        </CardContent>
      </Card>
      <FloatingActionButton href="/user/support/new" />
    </div>
  );
}
