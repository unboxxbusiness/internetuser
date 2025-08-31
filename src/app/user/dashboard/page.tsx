
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
import { getUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import { Wifi, Gauge, PieChart, Download } from "lucide-react";

export default async function UserDashboard() {
  const user = await getUser();
  if (!user || user.role !== "user") {
    redirect("/auth/login");
  }

  // --- Placeholder Data ---
  const subscription = {
    planName: "Premium Fiber",
    status: "active",
    price: 79.99,
    speed: 500,
    dataLimit: "Unlimited",
    nextBillingDate: "July 30, 2024",
  };

  const recentPayments = [
    {
      id: "INV-001",
      date: "June 30, 2024",
      amount: 79.99,
      status: "succeeded",
    },
    {
      id: "INV-002",
      date: "May 30, 2024",
      amount: 79.99,
      status: "succeeded",
    },
    {
      id: "INV-003",
      date: "April 30, 2024",
      amount: 79.99,
      status: "succeeded",
    },
  ];
  // --- End Placeholder Data ---

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome, {user.name || "User"}!
        </h2>
      </div>

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
            <div className="text-2xl font-bold">{subscription.dataLimit}</div>
            <p className="text-xs text-muted-foreground">Monthly allowance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Price</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${subscription.price}</div>
            <p className="text-xs text-muted-foreground">Auto-renews monthly</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>
            A history of your recent payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
