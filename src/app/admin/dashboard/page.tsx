
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { getPayments, getUsers } from "@/lib/firebase/server-actions";
import { RecentSales } from "@/components/recent-sales";
import { OverviewChart } from "@/components/overview-chart";
import { AppUser } from "@/app/auth/actions";
import { IndianRupee, Users, CreditCard, Activity } from "lucide-react";
import { Payment } from "@/lib/types";

export default async function AdminDashboardPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const [users, payments]: [AppUser[], Payment[]] = await Promise.all([
    getUsers(),
    getPayments(),
  ]);
  
  const totalCustomers = users.length;
  const activeSubscriptions = users.filter(u => u.role !== 'admin').length; // A proxy for active subscriptions
  const pendingPayments = 0; // Placeholder

  // Calculate monthly revenue for the chart
  const monthlyRevenueData = Array(12).fill(0).map((_, i) => {
    const monthName = new Date(0, i).toLocaleString('default', { month: 'short' });
    return { name: monthName, total: 0 };
  });

  payments.forEach(payment => {
      if (payment.status === 'succeeded') {
        const month = new Date(payment.date).getMonth();
        monthlyRevenueData[month].total += payment.amount;
      }
  });

  // Calculate total revenue for the current month for the card
  const currentMonth = new Date().getMonth();
  const currentMonthRevenue = monthlyRevenueData[currentMonth].total;


  return (
    <div className="flex-1 space-y-4">
       <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue (This Month)
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹
                  {currentMonthRevenue.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  revenue for the current month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{totalCustomers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  all-time user count
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Subscriptions
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{activeSubscriptions.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  currently active plans
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Payments
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pendingPayments.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  overdue and pending invoices
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewChart data={monthlyRevenueData} />
              </CardContent>
            </Card>
            <Card className="col-span-4 md:col-span-3">
              <CardHeader>
                <CardTitle>Recent Signups</CardTitle>
                <CardDescription>
                  {users.length} total users have joined.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales users={users.slice(0, 5)} />
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
