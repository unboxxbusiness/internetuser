'use client';

import type { Customer, Plan, Payment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, Home, Calendar, Wifi, Bell } from 'lucide-react';
import { PlanRecommender } from './plan-recommender';

interface CustomerDetailsClientProps {
  customer: Customer;
  plan: Plan | undefined;
  availablePlans: Plan[];
}

export function CustomerDetailsClient({ customer, plan, availablePlans }: CustomerDetailsClientProps) {
  const { toast } = useToast();

  const handleSendReminder = (payment: Payment) => {
    toast({
      title: 'Reminder Sent',
      description: `Payment reminder sent to ${customer.name} for invoice #${payment.id.slice(-6)}.`,
    });
  };

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{customer.name}</CardTitle>
          <CardDescription>Customer Profile and Service Details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> <span>{customer.email}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> <span>{customer.phone}</span></div>
              <div className="flex items-center gap-2"><Home className="h-4 w-4 text-muted-foreground" /> <span>{customer.address}</span></div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> <span>Joined on {new Date(customer.joinedDate).toLocaleDateString()}</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Wifi /> Current Subscription</CardTitle>
              <CardDescription>Plan details and usage information.</CardDescription>
            </div>
            <PlanRecommender customer={customer} availablePlans={availablePlans} />
          </CardHeader>
          <CardContent>
            {plan ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{plan.planName}</h3>
                  <p className="text-muted-foreground">{plan.bandwidth} - ${plan.cost.toFixed(2)}/mo</p>
                </div>
                <p className="text-sm">{plan.description}</p>
                <div>
                  <h4 className="font-semibold">Typical Use Cases</h4>
                  <p className="text-sm text-muted-foreground">{customer.typicalUseCases}</p>
                </div>
                 <div>
                  <h4 className="font-semibold">Usage History</h4>
                  <p className="text-sm text-muted-foreground">{customer.usageHistory}</p>
                </div>
              </div>
            ) : (
              <p>No active subscription plan.</p>
            )}
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Overview of recent payments and statuses.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.paymentHistory.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-right">
                      {(payment.status === 'pending' || payment.status === 'overdue') && (
                        <Button variant="ghost" size="icon" onClick={() => handleSendReminder(payment)}>
                          <Bell className="h-4 w-4" />
                          <span className="sr-only">Send Reminder</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
