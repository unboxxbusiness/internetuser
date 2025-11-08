
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { LifeBuoy, MessageSquare } from "lucide-react";
import { WhatsAppSupportButton } from "@/components/whatsapp-support-button";

export default async function UserSupportPage() {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Support</h2>
          <p className="text-muted-foreground">
            Get help and assistance from our team.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Have a question or need help with your service? Chat with us directly on WhatsApp for the fastest response.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center gap-6 p-10">
            <div className="bg-green-100 dark:bg-green-900/50 p-6 rounded-full">
                <MessageSquare className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Live Chat via WhatsApp</h3>
                <p className="text-muted-foreground max-w-md">
                    Our support team is available to assist you. Click the button below to start a conversation.
                </p>
            </div>
            <WhatsAppSupportButton user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
