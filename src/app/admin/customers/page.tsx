
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/app/auth/actions";
import { getCustomers } from "@/lib/firebase/firestore";
import { CustomerTable } from "@/components/customer-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminCustomersPage() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const customers = await getCustomers();

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/customers/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerTable customers={customers} />
        </CardContent>
      </Card>
    </div>
  );
}
