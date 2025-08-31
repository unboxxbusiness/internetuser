import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BarChart, Users, DollarSign, Edit, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Streamlined ISP Management with Gc Fiber Net
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A comprehensive solution for managing customer profiles,
                    subscription plans, and payment tracking, all in one
                    intuitive dashboard.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </div>
              </div>
              <div
                className="mx-auto aspect-[3/2] overflow-hidden rounded-xl bg-primary/20 sm:w-full"
                data-ai-hint="network abstract"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Core Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Powerful Tools for Your Business
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides everything you need to efficiently run
                  your internet service business.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Customer Profiles</h3>
                </div>
                <p className="text-muted-foreground">
                  Add and edit customer profiles with contact information and
                  service details.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Edit className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Subscription Management</h3>
                </div>
                <p className="text-muted-foreground">
                  Manage individual subscription plans, including plan type,
                  bandwidth, and costs.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Payment Tracking</h3>
                </div>
                <p className="text-muted-foreground">
                  Track payment statuses, send reminders, and manage payment
                  history.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Service Dashboard</h3>
                </div>
                <p className="text-muted-foreground">
                  View key metrics like active subscriptions and pending
                  payments at-a-glance.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Payment Prioritization</h3>
                </div>
                <p className="text-muted-foreground">
                  Use AI to prioritize payment reminders for at-risk users,
                  reducing churn.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Plan Recommender</h3>
                </div>
                <p className="text-muted-foreground">
                  AI-powered suggestions for the optimal subscription plan based
                  on customer usage.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
