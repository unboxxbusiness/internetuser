
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
import { TicketReplyForm } from "@/components/ticket-reply-form";
import { CloseTicketButton } from "@/components/close-ticket-button";
import { TicketMessages } from "@/components/ticket-messages";
import { ReopenTicketButton } from "@/components/reopen-ticket-button";


export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const ticket = await getSupportTicket(params.id);

  if (!ticket) {
      return (
         <div className="flex-1 space-y-4">
            <Button variant="outline" asChild>
                <Link href="/admin/support">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tickets
                </Link>
            </Button>
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not Found</AlertTitle>
                <AlertDescription>
                    The ticket you are looking for does not exist.
                </AlertDescription>
            </Alert>
        </div>
      )
  }

  return (
    <div className="flex-1 space-y-4">
       <div className="flex items-center justify-between space-y-2">
         <Button variant="outline" asChild>
           <Link href="/admin/support">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tickets
           </Link>
         </Button>
         {ticket.status !== 'closed' ? (
            <CloseTicketButton ticketId={ticket.id} />
         ) : (
            <ReopenTicketButton ticketId={ticket.id} />
         )}
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

            <TicketMessages messages={ticket.messages} />

            {ticket.status !== 'closed' && <TicketReplyForm ticketId={ticket.id} />}
            
            {ticket.status === 'closed' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Ticket Closed</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">This ticket has been closed. You can re-open it to continue the conversation.</p>
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
                        <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span>{ticket.lastUpdated ? new Date(ticket.lastUpdated).toLocaleString() : 'N/A'}</span>
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

    

    