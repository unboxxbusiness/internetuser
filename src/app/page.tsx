
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "./auth/actions";
import { getHeroSettings } from "@/lib/firebase/server-actions";
import { Button } from "@/components/ui/button";
import { Users, Package, CreditCard, LayoutDashboard, Search, LifeBuoy } from "lucide-react";

export default async function LandingPage() {
  const user = await getUser();

  if (user) {
    if (user.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/user/dashboard");
    }
  }

  const heroSettings = await getHeroSettings();
  
  return (
    <>
     <section className="py-12 sm:py-24 md:py-32 lg:py-40 bg-gradient-to-br from-background to-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  {heroSettings?.heading || "Seamless Connectivity, Unmatched Speed."}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                 {heroSettings?.subheading || "Experience the future of internet with our fiber optic network. Reliable, fast, and always on."}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/auth/signup">
                    {heroSettings?.ctaText || "Get Started"}
                  </Link>
                </Button>
                 <Button asChild variant="outline" size="lg">
                    <Link href="/user/plans">
                        View Plans
                    </Link>
                </Button>
              </div>
            </div>
            <Image
              src="/hero-image.svg"
              width={800}
              height={600}
              alt="Hero"
              data-ai-hint="earth space"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>
      <section id="features" className="py-12 sm:py-24 md:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need, all in one place.</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides a comprehensive suite of tools to manage your internet service effortlessly.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Profile Management</h3>
              <p className="text-sm text-muted-foreground">Keep your contact and service details up-to-date in one central location.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center">
                <Package className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Flexible Subscription Plans</h3>
              <p className="text-sm text-muted-foreground">View, compare, and switch between subscription plans that fit your needs.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center">
                <CreditCard className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Secure Billing</h3>
              <p className="text-sm text-muted-foreground">Track your payments, view history, and download invoices with ease.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center">
                <LayoutDashboard className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Service Dashboard</h3>
              <p className="text-sm text-muted-foreground">Get an at-a-glance overview of your current plan and service status.</p>
            </div>
             <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center">
                    <Search className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Plan Recommender</h3>
                <p className="text-sm text-muted-foreground">Get smart recommendations for the best plan based on your usage.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center">
                <LifeBuoy className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-bold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Create and track support tickets anytime you need assistance.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
