import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { CustomerTable } from "@/components/customer-table";
import { getCustomers } from "@/lib/firebase/firestore";

export default async function HomePage() {
  const customers = await getCustomers();
  
  const totalCustomers = customers.length;
  const activeSubscriptions = customers.filter(c => c.paymentStatus !== 'Canceled').length;
  const pendingPayments = customers.filter(c => c.paymentStatus === 'Pending' || c.paymentStatus === 'Overdue').length;
  const monthlyRevenue = activeSubscriptions * 50; // Assuming an average of $50/customer

  const stats = [
    { title: "Total Customers", value: totalCustomers.toLocaleString() },
    { title: "Active Subscriptions", value: activeSubscriptions.toLocaleString() },
    { title: "Pending Payments", value: pendingPayments.toLocaleString() },
    { title: "Monthly Revenue", value: `$${monthlyRevenue.toLocaleString()}` },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customers</CardTitle>
          <Button asChild>
            <Link href="/customers/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <CustomerTable customers={customers} />
        </CardContent>
      </Card>
    </div>
  );
}
