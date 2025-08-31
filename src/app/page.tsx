import { AppLayout } from '@/components/layout/app-layout';
import { summarizeServiceOverview } from '@/ai/flows/summarize-service-overview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { customers } from '@/lib/data';
import { DollarSign, Users, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const activeSubscriptions = customers.length;
  const pendingPayments = customers.reduce((acc, customer) => {
    const pending = customer.paymentHistory.find(p => p.status === 'pending' || p.status === 'overdue');
    return pending ? acc + pending.amount : acc;
  }, 0);
  const serviceUtilization = 85.4; // Mock data

  const usersAtRisk = customers
    .map(c => ({
      ...c,
      overdueBalance: c.paymentHistory
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0),
    }))
    .filter(c => c.overdueBalance > 0)
    .map(c => ({ userId: c.id, overdueBalance: c.overdueBalance, name: c.name }));

  const aiSummary = await summarizeServiceOverview({
    activeSubscriptions,
    pendingPayments,
    serviceUtilization,
    usersAtRisk: usersAtRisk.map(({ userId, overdueBalance }) => ({ userId, overdueBalance })),
  });

  const priorityCustomers = usersAtRisk.filter(u => aiSummary.priorityUsersForReminder.includes(u.userId));

  return (
   <AppLayout>
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Total active customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${pendingPayments.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all overdue accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Service Utilization
            </CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceUtilization}%</div>
            <p className="text-xs text-muted-foreground">
              Peak network capacity usage
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Service Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{aiSummary.summary}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" />
              Prioritized Payment Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {priorityCustomers.length > 0 ? (
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Overdue Balance</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priorityCustomers.map(user => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-right">${user.overdueBalance.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                           <Link href={`/customers/${user.userId}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
                <div className="flex flex-col items-center justify-center text-center gap-2 py-8">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <h3 className="font-semibold">All Clear!</h3>
                    <p className="text-muted-foreground text-sm">No users are prioritized for payment reminders.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
   </AppLayout>
  );
}
