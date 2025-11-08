"use client";

import { useScroll, useTransform } from "framer-motion";
import React from "react";
import { GoogleGeminiEffect } from "@/components/google-gemini-effect";
import { redirect } from "next/navigation";
import { getUser } from "./auth/actions";
import { getPlans, getBrandingSettings } from "@/lib/firebase/server-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Phone, Zap, MessageCircle, DollarSign, Signal, Star, Wifi, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "@/components/cta-section";
import Image from "next/image";
import { AuroraHero } from "@/components/aurora-hero";
import { Meteors } from "@/components/ui/meteors";

const whyChooseUsPoints = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "High-Speed Plans",
    description: "Up to 1 Gbps for streaming, gaming, and remote work.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    title: "Local Support",
    description: "Friendly customer care, right here in South Delhi.",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: "No Hidden Charges",
    description: "Simple, honest pricing you can trust.",
  },
  {
    icon: <Signal className="h-8 w-8 text-primary" />,
    title: "Stable Connectivity",
    description: "Consistent speeds even during peak hours.",
  },
  {
    icon: <Wifi className="h-8 w-8 text-primary" />,
    title: "Proudly Local",
    description: "We live where you live. Your support builds our community.",
  },
];

const testimonials = [
    {
        quote: "Best local internet in Aali Village! Great speed and quick support.",
        author: "Rajesh K.",
        avatar: "https://picsum.photos/seed/1/100/100"
    },
    {
        quote: "Finally, no buffering! My kids love it for online classes and gaming.",
        author: "Suman R.",
        avatar: "https://picsum.photos/seed/2/100/100"
    },
    {
        quote: "Affordable and honest service — way better than the big companies.",
        author: "Deepak M.",
        avatar: "https://picsum.photos/seed/3/100/100"
    }
]

// This is a server component to fetch initial data
async function LandingPageData() {
  const user = await getUser();

  if (user) {
    if (user.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/user/dashboard");
    }
  }
  const [plans, branding] = await Promise.all([
      getPlans(),
      getBrandingSettings(),
  ]);

  return { plans, branding };
}

export default function LandingPage() {
  const [data, setData] = React.useState<{plans: any[], branding: any} | null>(null);

  React.useEffect(() => {
    async function fetchData() {
        const result = await LandingPageData();
        setData(result);
    }
    fetchData();
  }, []);

  const displayPlans = data?.plans.slice(0, 3) || [];

  return (
    <div className="bg-background text-foreground">
      <div className="relative">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
          <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
            <Meteors number={20} />
             <main id="about" className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-20 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="mb-8 float-animation">
                        <h1 className="md:text-6xl lg:text-7xl leading-[1.1] text-5xl font-bold tracking-tight mb-4">
                            Fast, Reliable, Local Internet
                            <span className="gradient-text block tracking-tight">for Aali Village, Delhi.</span>
                        </h1>
                        <p className="md:text-xl max-w-3xl leading-relaxed text-lg font-light text-white/80 mx-auto">Experience smooth streaming, lag-free gaming, and dependable connectivity — powered by your trusted local ISP right here in Aali Village.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/auth/signup" className="primary-button px-6 py-3 rounded-lg font-medium text-sm min-w-[180px] text-center">🚀 Check Availability</Link>
                        <Link href="tel:9999999999" className="glass-button min-w-[180px] text-sm font-medium rounded-lg px-6 py-3 text-center">📞 Call Now</Link>
                    </div>
                </div>
            </main>
          </div>
      </div>
      
      {/* Plans & Pricing */}
      <section id="plans" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Choose a Plan That Fits Your Lifestyle</h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Simple, transparent pricing with no hidden fees. Get connected with the best plan for you.</p>
                   <Badge variant="secondary" className="mt-4 text-sm">No setup fee for new connections in Aali Village this month!</Badge>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {displayPlans.map((plan) => (
                        <Card key={plan.id} className="flex flex-col shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold tracking-tight">₹{plan.price}</span>
                                    <span className="text-muted-foreground">/ month</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <div className="bg-primary/10 text-primary font-semibold p-3 rounded-md text-center">
                                    Up to {plan.speed} Mbps Speed
                                </div>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span>{plan.dataLimit} GB Data Limit</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span>Ideal for {plan.speed <= 50 ? "Browsing & Streaming" : plan.speed <= 150 ? "HD Streaming & Families" : "4K, Gaming & WFH"}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span>24/7 Customer Support</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href="/auth/signup">Choose Plan <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
              </div>
              <div className="text-center mt-12">
                <Button variant="outline" asChild>
                  <Link href="/user/plans">View All Plans</Link>
                </Button>
              </div>
          </div>
      </section>

      {/* Why Choose Us */}
      <section id="features" className="py-16 md:py-24 bg-muted dark:bg-card">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">Why Aali Village Chooses Us</h2>
                   <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Internet that just works, backed by people you know.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
                  {whyChooseUsPoints.map((point) => (
                      <div key={point.title} className="text-center flex flex-col items-center p-4">
                          <div className="mb-4 bg-primary/10 p-4 rounded-full">{point.icon}</div>
                          <h3 className="text-lg font-semibold">{point.title}</h3>
                          <p className="mt-1 text-muted-foreground text-sm">{point.description}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Testimonials */}
       <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">What Your Neighbors Are Saying</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="flex flex-col justify-between">
                            <CardContent className="pt-6">
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_,i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <blockquote className="text-lg font-medium">“{testimonial.quote}”</blockquote>
                            </CardContent>
                             <CardFooter className="flex items-center gap-4 mt-4">
                               <img
                                 width={40} 
                                 height={40} 
                                 className="rounded-full" 
                                 src={testimonial.avatar} 
                                 alt={testimonial.author} 
                               />
                               <div>
                                 <p className="font-semibold">{testimonial.author}</p>
                                 <p className="text-sm text-muted-foreground">Aali Village Resident</p>
                               </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
       </section>

        {/* Final CTA */}
        <CTASection 
            badge={{ text: "Get Started Today" }}
            title="Ready for Faster Internet in Aali Village?"
            description="Join hundreds of happy local customers already connected with us. Setup takes less than 24 hours."
            action={{ text: "✅ Check Availability", href: "/auth/signup" }}
        />

    </div>
  );
}
