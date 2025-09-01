import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Subscription Card Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48 mt-1" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-56" />
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Payments Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-56" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="w-full text-sm">
              <div className="border-b">
                <div className="flex h-12 items-center px-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                </div>
              </div>
              <div>
                {[...Array(3)].map(i => (
                    <div className="flex h-14 items-center px-4 border-b" key={i}>
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20 ml-auto" />
                        <Skeleton className="h-4 w-20 ml-auto" />
                        <Skeleton className="h-6 w-16 ml-auto rounded-full" />
                        <Skeleton className="h-8 w-32 ml-auto" />
                    </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
