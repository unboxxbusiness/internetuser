import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { getSupportTickets } from "@/lib/firebase/firestore";
import { SupportTicketTable } from "@/components/support-ticket-table";
import { SupportTicket } from "@/lib/types";

export default async function AdminSupportPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const tickets = await getSupportTickets();

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Support Requests</CardTitle>
          <CardDescription>
            View, track, and respond to user-submitted support tickets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupportTicketTable tickets={tickets} />
        </CardContent>
      </Card>
    </div>
  );
}
