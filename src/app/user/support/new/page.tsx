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
import { getUser } from "@/app/auth/actions";
import { ArrowLeft } from "lucide-react";
import { NewTicketForm } from "@/components/new-ticket-form";

export default async function NewSupportTicketPage() {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight">Create a Support Ticket</h2>
         <Button variant="outline" asChild>
          <Link href="/user/support">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit a New Request</CardTitle>
          <CardDescription>
            Please provide as much detail as possible so we can assist you effectively.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewTicketForm />
        </CardContent>
      </Card>
    </div>
  );
}
