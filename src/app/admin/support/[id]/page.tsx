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
import { getSupportTicket } from "@/lib/firebase/firestore";
import { SupportTicket } from "@/lib/types";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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
