import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: 49,
    features: ["Up to 100 Mbps", "Unlimited Data", "Standard Support"],
    isPopular: false,
  },
  {
    name: "Premium",
    price: 79,
    features: [
      "Up to 500 Mbps",
      "Unlimited Data",
      "Priority Support",
      "Free Router",
    ],
    isPopular: true,
  },
  {
    name: "Ultimate",
    price: 99,
    features: [
      "Up to 1 Gbps",
      "Unlimited Data",
      "Premium Support",
      "Free Router & Installation",
    ],
    isPopular: false,
  },
];

export function Offers() {
  return (
    <section id="plans" className="py-16 sm:py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight text-slate-900 dark:text-white">
          Choose Your Perfect Plan
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-slate-600 dark:text-slate-400">
          Simple, transparent pricing for everyone.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col gap-6 rounded-lg border bg-white p-8 shadow-sm hover:shadow-lg transition-shadow relative ${
                plan.isPopular ? "border-2 border-primary" : "border-slate-200"
              } dark:bg-slate-900 dark:border-slate-700`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-center">
                <h3
                  className={`text-xl font-bold ${
                    plan.isPopular ? "text-primary" : "text-slate-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </h3>
                <p className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-lg font-semibold text-slate-500 dark:text-slate-400">
                    /month
                  </span>
                </p>
              </div>

              <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-6 w-6 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.isPopular ? "default" : "secondary"}
                className="mt-auto w-full h-12 text-base font-bold tracking-wide"
              >
                <Link href="/auth/signup">Choose Plan</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
