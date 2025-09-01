import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-40" />
            </CardTitle>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-32" />
            </CardTitle>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-28" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-36" />
            </CardTitle>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-40" />
            </CardTitle>
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-8 mb-2" />
            <Skeleton className="h-3 w-36" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-36" /></CardTitle>
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div className="flex items-center" key={i}>
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="ml-4 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
