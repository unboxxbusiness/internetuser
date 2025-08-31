import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { CustomerTable } from "@/components/customer-table";
import { placeholderCustomers } from "@/lib/placeholder-data";

export default function DashboardPage() {
  const stats = [
    { title: "Total Customers", value: "1,250" },
    { title: "Active Subscriptions", value: "1,180" },
    { title: "Pending Payments", value: "70" },
    { title: "Monthly Revenue", value: "$59,000" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
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
          <CustomerTable customers={placeholderCustomers} />
        </CardContent>
      </Card>
    </div>
  );
}
