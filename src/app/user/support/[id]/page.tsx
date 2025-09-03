
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUser } from "@/app/auth/actions";
import { getSupportTicket } from "@/lib/firebase/server-actions";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TicketMessages } from "@/components/ticket-messages";
import { UserTicketReplyForm } from "@/components/user-ticket-reply-form";
import { ReopenTicketButton } from "@/components/reopen-ticket-button";

export default async function UserTicketDetailPage({ params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const ticket = await getSupportTicket(params.id);

  if (!ticket || ticket.userId !== user.uid) {
      return (
         <div className="flex-1 space-y-4">
            <Button variant="outline" asChild>
                <Link href="/user/support">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Tickets
                </Link>
            </Button>
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not Found</AlertTitle>
                <AlertDescription>
                    The ticket you are looking for does not exist or you don't have permission to view it.
                </AlertDescription>
            </Alert>
        </div>
      )
  }

  return (
    <div className="flex-1 space-y-4">
       <div className="flex items-center justify-between space-y-2">
         <Button variant="outline" asChild>
           <Link href="/user/support">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Tickets
           </Link>
         </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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

            <TicketMessages messages={ticket.messages} />

            {ticket.status !== 'closed' && <UserTicketReplyForm ticketId={ticket.id} />}
            
            {ticket.status === 'closed' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Ticket Closed</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                       <p className="text-muted-foreground">This ticket has been closed. If the issue persists, please re-open it.</p>
                       <ReopenTicketButton ticketId={ticket.id} />
                    </CardContent>
                </Card>
            )}

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
        </div>
      </div>
    </div>
  );
}
