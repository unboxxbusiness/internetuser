import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { SupportTicketTable } from "@/components/support-ticket-table";
import { SupportTicket } from "@/lib/types";

// Mock data for tickets
const mockTickets: SupportTicket[] = [
  {
    id: "TICKET-001",
    subject: "Cannot connect to the internet",
    user: {
      name: "Alice Johnson",
      email: "alice@example.com",
    },
    status: "open",
    priority: "high",
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "TICKET-002",
    subject: "Slow speeds in the evening",
    user: {
      name: "Bob Williams",
      email: "bob@example.com",
    },
    status: "in-progress",
    priority: "medium",
    lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "TICKET-003",
    subject: "Billing question about my last invoice",
    user: {
      name: "Charlie Brown",
      email: "charlie@example.com",
    },
    status: "closed",
    priority: "low",
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
];


export default async function AdminSupportPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  // In the future, you would fetch real tickets from Firestore here.
  const tickets = mockTickets;

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
