
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUser, AppUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import { Wifi, Gauge, PieChart, Download, AlertTriangle, IndianRupee, Loader2 } from "lucide-react";
import { getUserSubscription } from "@/lib/firebase/server-actions";
import { getUserPayments } from "@/lib/firebase/client-actions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Payment, Subscription } from "@/lib/types";

export default function UserDashboard() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const currentUser = await getUser();
      if (!currentUser || currentUser.role !== "user") {
        redirect("/auth/login");
        return;
      }
      setUser(currentUser);
      
      const [sub, payments] = await Promise.all([
        getUserSubscription(currentUser.uid),
        getUserPayments(currentUser.uid),
      ]);

      setSubscription(sub);
      setRecentPayments(payments.slice(0,3));
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.name || "User"}!
        </h2>
      </div>

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
            <CardHeader className="flex-row items-center gap-4">
                <AlertTriangle className="w-10 h-10 text-destructive" />
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
            {recentPayments.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentPayments.map((payment) => (
                        <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id.substring(0,8)}...</TableCell>
                        <TableCell>{payment.date.toLocaleDateString()}</TableCell>
                        <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                        <TableCell>
                            <Badge
                            variant={
                                payment.status === "succeeded"
                                ? "secondary"
                                : "destructive"
                            }
                            >
                            {payment.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>No recent payments found.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
