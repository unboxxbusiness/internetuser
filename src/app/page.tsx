
import { redirect } from "next/navigation";
import { getUser } from "./auth/actions";
import { HeroGeometric } from "@/components/hero-geometric";
import { cn } from "@/lib/utils";
import {
  Users,
  Package,
  CreditCard,
  LayoutDashboard,
  WandSparkles,
  LifeBuoy,
} from "lucide-react";
import { CTASection } from "@/components/cta-section";

const features = [
  {
    title: "Effortless Profile Management",
    description:
      "Easily view and update your contact and service details in one central, secure location.",
    icon: <Users size={28} />,
    index: 0,
  },
  {
    title: "Flexible Subscription Plans",
    description:
      "Browse, compare, and switch between a variety of high-speed internet plans that perfectly fit your needs.",
    icon: <Package size={28} />,
    index: 1,
  },
  {
    title: "Secure & Transparent Billing",
    description:
      "Track your payments, view your billing history, and download invoices with just a few clicks.",
    icon: <CreditCard size={28} />,
    index: 2,
  },
  {
    title: "Real-Time Service Dashboard",
    description:
      "Get an at-a-glance overview of your current plan, data usage, and service status anytime.",
    icon: <LayoutDashboard size={28} />,
    index: 3,
  },
  {
    title: "AI-Powered Plan Recommender",
    description:
      "Let our smart assistant analyze your usage and recommend the best-value plan for you.",
    icon: <WandSparkles size={28} />,
    index: 4,
  },
  {
    title: "24/7 Customer Support",
    description:
      "Need help? Create and track support tickets directly from your dashboard, anytime you need assistance.",
    icon: <LifeBuoy size={28} />,
    index: 5,
  },
];

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 3) && "lg:border-l dark:border-neutral-800",
        index < 3 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-muted/50 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-muted/50 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-primary">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};


export default async function LandingPage() {
  const user = await getUser();

  if (user) {
    if (user.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/user/dashboard");
    }
  }
  
  return (
    <>
        <HeroGeometric 
            badge="Gc Fiber Net"
            title1="Seamless Connectivity"
            title2="Unmatched Speeds"
        />
         <section id="features" className="py-12 sm:py-24 md:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need, all in one place.
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides a comprehensive suite of tools to manage
                  your internet service effortlessly.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 py-10 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>
        <CTASection
            title="Ready to Get Started?"
            description="Sign up today and experience the future of internet connectivity."
            action={{
                text: "Create Your Account",
                href: "/auth/signup",
            }}
        />
    </>
  );
}
