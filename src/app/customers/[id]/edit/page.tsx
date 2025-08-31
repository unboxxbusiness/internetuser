import {
  getCustomerById,
} from "@/lib/firebase/firestore";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { updateCustomerAction } from "@/app/actions";

export default async function EditCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const customer = await getCustomerById(params.id);
  if (!customer) {
    notFound();
  }

  const updateAction = updateCustomerAction.bind(null, customer.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={customer.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={customer.email}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="plan">Subscription Plan</Label>
                <Select name="plan" defaultValue={customer.plan} required>
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic - 50 Mbps</SelectItem>
                    <SelectItem value="Premium">Premium - 200 Mbps</SelectItem>
                    <SelectItem value="Pro">Pro - 1 Gbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  name="paymentStatus"
                  defaultValue={customer.paymentStatus}
                  required
                >
                  <SelectTrigger id="paymentStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" asChild>
                <Link href="/">Cancel</Link>
              </Button>
              <Button type="submit">Update Customer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
