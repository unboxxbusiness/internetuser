
import { Suspense } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import { Wifi, Gauge, PieChart, Download, AlertTriangle, IndianRupee, Bell, ArrowRight } from "lucide-react";
import { getUserSubscription, getUserPayments, getUserNotifications } from "@/lib/firebase/server-actions";
import Link from "next/link";
import { UserPaymentTable } from "@/components/user-payment-table";
import { UserDashboardSkeleton } from "@/components/user-dashboard-skeleton";


async function DashboardData({ user }: { user: NonNullable<Awaited<ReturnType<typeof getUser>>> }) {
  const [subscription, recentPayments, notifications] = await Promise.all([
    getUserSubscription(user.uid),
    getUserPayments(user.uid),
    getUserNotifications(user.uid),
  ]);

  const latestPayments = recentPayments.slice(0, 5);
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const latestUnreadNotification = unreadNotifications.length > 0 ? unreadNotifications[0] : null;

  return (
    <div className="space-y-6">
      {latestUnreadNotification && (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertTitle className="font-semibold">{latestUnreadNotification.title}</AlertTitle>
          <AlertDescription>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <p className="text-sm">{latestUnreadNotification.message}</p>
                  <Button asChild variant="link" className="p-0 h-auto self-start sm:self-center">
                      <Link href="/user/notifications">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
              </div>
          </AlertDescription>
        </Alert>
      )}

      {subscription ? (
        <>
        <Card className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground">
            <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>Subscription Status</span>
                <Badge
                variant={
                    subscription.status === "active" ? "default" : "destructive"
                }
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                {subscription.status}
                </Badge>
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
                Your current plan is{" "}
                <span className="font-semibold">{subscription.planName}</span>.
            </CardDescription>
            </CardHeader>
            <CardFooter>
            <p className="text-sm text-primary-foreground/90">
                Next billing date: {subscription.nextBillingDate}
            </p>
            </CardFooter>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plan Speed</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{subscription.speed} Mbps</div>
                <p className="text-xs text-muted-foreground">Download/Upload</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Limit</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{subscription.dataLimit === 'Unlimited' ? 'Unlimited' : `${subscription.dataLimit} GB`}</div>
                <p className="text-xs text-muted-foreground">Monthly allowance</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Price</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{subscription.price.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Auto-renews monthly</p>
            </CardContent>
            </Card>
        </div>
        </>
      ) : (
         <Card className="border-dashed">
            <CardHeader className="flex-col sm:flex-row items-start sm:items-center gap-4">
                <AlertTriangle className="w-10 h-10 text-destructive flex-shrink-0" />
                <div>
                    <CardTitle>No Active Subscription</CardTitle>
                    <CardDescription>You do not have an active subscription plan. Please choose a plan to get started.</CardDescription>
                </div>
            </CardHeader>
            <CardFooter>
                <Button asChild>
                    <Link href="/user/plans">View Plans</Link>
                </Button>
            </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>
            A history of your recent payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserPaymentTable payments={latestPayments} user={user} />
        </CardContent>
      </Card>
    </div>
  );
}


export default async function UserDashboardPage() {
  const user = await getUser();
  if (!user || user.role !== 'user') {
    redirect('/auth/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.name || "User"}!
        </h2>
      </div>
      <Suspense fallback={<UserDashboardSkeleton />}>
        <DashboardData user={user} />
      </Suspense>
    </div>
  );
}
