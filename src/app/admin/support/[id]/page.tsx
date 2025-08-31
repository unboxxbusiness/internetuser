import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getUser } from "@/app/auth/actions";
import { SupportTicket } from "@/lib/types";
import { ArrowLeft, Send } from "lucide-react";

// Mock data for a single ticket - in a real app, you'd fetch this by ID
const mockTicket: SupportTicket = {
  id: "TICKET-001",
  subject: "Cannot connect to the internet",
  description: "My router seems to be online and the lights are green, but none of my devices can access the internet. I've tried restarting the router and my computer multiple times. This started happening about an hour ago. Can you please help?",
  user: {
    name: "Alice Johnson",
    email: "alice@example.com",
  },
  status: "open",
  priority: "high",
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
};

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  // In the future, you would fetch the real ticket by `params.id` from Firestore
  const ticket = mockTicket;

  return (
    <div className="flex-1 space-y-4">
       <div className="flex items-center justify-between space-y-2">
         <Button variant="outline" asChild>
           <Link href="/admin/support">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tickets
           </Link>
         </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                    <CardDescription>
                       Ticket ID: {ticket.id}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Respond to Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="grid gap-2">
                        <Label htmlFor="reply" className="sr-only">Reply</Label>
                        <Textarea id="reply" placeholder="Type your response here..." className="min-h-[120px]" />
                     </div>
                </CardContent>
                <CardFooter>
                     <Button>
                        <Send className="mr-2 h-4 w-4" /> Send Reply
                    </Button>
                </CardFooter>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ticket Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={ticket.status === 'closed' ? 'secondary' : (ticket.status === 'open' ? 'destructive' : 'default')}>{ticket.status}</Badge>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Priority</span>
                         <Badge variant={ticket.priority === 'low' ? 'secondary' : (ticket.priority === 'high' ? 'destructive' : 'outline')}>{ticket.priority}</Badge>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span>{ticket.createdAt?.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span>{ticket.lastUpdated?.toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                   <p className="font-semibold">{ticket.user.name}</p>
                   <p className="text-muted-foreground">{ticket.user.email}</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
