import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserDashboardPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>User Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome, User! This is your secure dashboard.</p>
        </CardContent>
      </Card>
    </div>
  );
}
