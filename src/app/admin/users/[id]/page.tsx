
import { redirect } from "next/navigation";
import { getUser, AppUser } from "@/app/auth/actions";
import { 
    getUser as getUserData,
    getUserSubscription,
    getUserPayments,
} from "@/lib/firebase/server-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Wifi, IndianRupee, MessageSquare, LifeBuoy } from "lucide-react";
import { PaymentTable } from "@/components/payment-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { WhatsAppSupportButton } from "@/components/whatsapp-support-button";

function getInitials(name?: string) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}


export default async function AdminUserDetailsPage({ params }: { params: { id: string } }) {
    const adminUser = await getUser();
    if (!adminUser || adminUser.role !== 'admin') {
        redirect('/auth/login');
    }

    const userData = await getUserData(params.id);

    if (!userData) {
        return (
            <div className="flex-1 space-y-4">
                <Button variant="outline" asChild>
                    <Link href="/admin/users">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
                    </Link>
                </Button>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>User Not Found</AlertTitle>
                    <AlertDescription>
                        The user you are looking for does not exist.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
    
    // Fetch all user-related data in parallel
    const [subscription, payments] = await Promise.all([
        getUserSubscription(userData.uid),
        getUserPayments(userData.uid),
    ]);


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="outline" asChild>
                <Link href="/admin/users">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Users
                </Link>
                </Button>
                 <WhatsAppSupportButton user={userData} isAdmin={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="items-center text-center">
                             <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={userData.photoURL || undefined} alt={userData.name || ""} />
                                <AvatarFallback className="text-3xl">{getInitials(userData.name)}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl">{userData.name}</CardTitle>
                            <CardDescription>{userData.email}</CardDescription>
                            <Badge variant={userData.role === 'admin' ? "default" : "secondary"}>
                                {userData.role}
                            </Badge>
                        </CardHeader>
                        <CardContent className="text-sm text-center text-muted-foreground">
                            User ID: {userData.uid}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wifi className="w-5 h-5 text-primary" />
                                <span>Current Subscription</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {subscription ? (
                                <div className="space-y-3">
                                    <h4 className="text-xl font-semibold">{subscription.planName}</h4>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Price</span>
                                        <span>₹{subscription.price.toFixed(2)} / month</span>
                                    </div>
                                     <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Speed</span>
                                        <span>{subscription.speed} Mbps</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Data Limit</span>
                                        <span>{subscription.dataLimit} GB</span>
                                    </div>
                                     <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Status</span>
                                        <Badge variant={subscription.status === 'active' ? 'secondary' : 'destructive'}>{subscription.status}</Badge>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-4">No active subscription.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <IndianRupee className="w-5 h-5 text-primary" />
                                <span>Payment History</span>
                            </CardTitle>
                             <CardDescription>
                                A complete record of this user's payments.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PaymentTable payments={payments} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
