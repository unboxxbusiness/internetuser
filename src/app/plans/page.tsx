import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { availablePlans } from "@/lib/data";
import { PlusCircle } from "lucide-react";

export default function PlansPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Manage available service plans for customers.</CardDescription>
        </div>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Plan
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Bandwidth</TableHead>
              <TableHead>Monthly Cost</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availablePlans.map(plan => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.planName}</TableCell>
                <TableCell>{plan.bandwidth}</TableCell>
                <TableCell>${plan.cost.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">{plan.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
