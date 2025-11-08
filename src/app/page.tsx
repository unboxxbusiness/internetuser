
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
import { Meteors } from "@/components/ui/meteors";
import { DataUsageCalculator } from "@/components/data-usage-calculator";

const whyChooseUsPoints = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Super-Fast Speeds",
    description: "Stream, game, and video call without lag.",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: "Affordable Plans",
    description: "Internet for every budget, starting at just ₹499/month.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    title: "Local Support",
    description: "Get quick help from real people right here in South Delhi.",
  },
  {
    icon: <Signal className="h-8 w-8 text-primary" />,
    title: "Stable Connection",
    description: "Smooth, uninterrupted performance all day.",
  },
  {
    icon: <Wifi className="h-8 w-8 text-primary" />,
    title: "Trusted by Locals",
    description: "Hundreds of happy users in Aali Village & nearby.",
  },
];

const testimonials = [
    {
        quote: "Best internet in Aali Village! Reliable and super fast.",
        author: "Rahul S.",
        avatar: "https://picsum.photos/seed/1/100/100"
    },
    {
        quote: "Affordable and perfect for work from home.",
        author: "Meena K.",
        avatar: "https://picsum.photos/seed/2/100/100"
    },
    {
        quote: "Their support team is amazing — quick and local!",
        author: "Sunil D.",
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

  const displayPlans = data?.plans || [];
  
  const businessPlan = displayPlans.find(p => p.name === 'Business Plan');
  const regularPlans = displayPlans.filter(p => p.name !== 'Business Plan');


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
                            Fast, Reliable & Affordable Internet
                            <span className="gradient-text block tracking-tight">in Aali Village, Delhi</span>
                        </h1>
                        <p className="md:text-xl max-w-3xl leading-relaxed text-lg font-light text-white/80 mx-auto">Say goodbye to slow connections! Enjoy super-fast broadband, unlimited data, and friendly local support — all from your trusted neighborhood Internet provider.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="#plans" className="primary-button px-6 py-3 rounded-lg font-medium text-sm min-w-[180px] text-center">🚀 Check Internet Plans</Link>
                        <Link href="tel:9999999999" className="glass-button min-w-[180px] text-sm font-medium rounded-lg px-6 py-3 text-center">📞 Call 9999-XXX-XXX</Link>
                    </div>
                </div>
            </main>
          </div>
      </div>
      
       {/* Why Choose Us */}
      <section id="features" className="py-16 md:py-24 bg-muted dark:bg-card">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">Delhi’s Most Reliable Local Internet Service</h2>
                   <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">We’re not a big company — we’re your neighbors. That’s why we care more, respond faster, and deliver better value.</p>
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
               <div className="text-center mt-12">
                <Button asChild>
                  <Link href="#plans">✨ View Plans & Prices</Link>
                </Button>
              </div>
          </div>
      </section>

      {/* Data Usage Calculator */}
      <DataUsageCalculator plans={displayPlans} />

      {/* Plans & Pricing */}
      <section id="plans" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Choose the Right Internet Plan for You</h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Simple, transparent pricing with no hidden fees. Get connected with the best plan for you.</p>
                   <Badge variant="secondary" className="mt-4 text-sm">🎉 Free installation for new connections this month!</Badge>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {regularPlans.map((plan) => (
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
                                        <span>Unlimited Data</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span>Ideal for {
                                            plan.name === 'Basic Plan' ? 'Browsing, WhatsApp, YouTube' :
                                            plan.name === 'Family Plan' ? 'HD streaming, work from home' :
                                            'Gamers, multiple users'
                                        }</span>
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

               {businessPlan && (
                <div className="mt-12 max-w-4xl mx-auto">
                     <Card className="flex flex-col md:flex-row shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 border-2 border-primary">
                        <CardHeader className="flex-1 p-8">
                            <Badge variant="default" className="w-fit mb-4">For Businesses</Badge>
                            <CardTitle className="text-3xl font-bold">{businessPlan.name}</CardTitle>
                             <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-5xl font-extrabold tracking-tight">₹{businessPlan.price}</span>
                                <span className="text-muted-foreground text-lg">/ month</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-8 grid grid-cols-2 gap-6">
                             <div className="flex items-center gap-3">
                                <Zap className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="font-semibold">Up to {businessPlan.speed} Mbps</p>
                                    <p className="text-sm text-muted-foreground">Symmetrical Speed</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Signal className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="font-semibold">Unlimited Data</p>
                                    <p className="text-sm text-muted-foreground">No FUP Limits</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MessageCircle className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="font-semibold">Dedicated Support</p>
                                    <p className="text-sm text-muted-foreground">Priority Service</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                <Phone className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="font-semibold">Static IP Available</p>
                                    <p className="text-sm text-muted-foreground">On Request</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-1 p-8 items-center justify-center">
                             <Button asChild size="lg" className="w-full md:w-auto">
                                <Link href="/auth/signup">Get Business Plan <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
              )}

              <div className="text-center mt-12">
                <Button variant="outline" asChild>
                  <Link href="/auth/signup">🚀 Get Connected in 24 Hours</Link>
                </Button>
              </div>
          </div>
      </section>

      {/* Coverage Area */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">Now Available Across Aali Village & South Delhi</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">We proudly serve homes and businesses in: 📍 Aali Village • Jasola • Sarita Vihar • Badarpur • Shaheen Bagh • Okhla</p>
                <div className="mt-8">
                     <Button asChild variant="outline">
                        <Link href="/auth/signup">📍 Check Availability in Your Area</Link>
                    </Button>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials */}
       <section className="py-16 md:py-24 bg-muted dark:bg-card">
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
                 <div className="text-center mt-12">
                    <Button asChild variant="secondary">
                        <Link href="#">⭐ See More Local Reviews</Link>
                    </Button>
                 </div>
            </div>
       </section>

        {/* Final CTA */}
        <CTASection 
            badge={{ text: "Get Started Today" }}
            title="Switch to Faster, Better Internet Today"
            description="Join hundreds of happy users already connected with Aali Village’s favorite ISP. Installation in under 24 hours!"
            action={{ text: "✅ Check Plans & Pricing", href: "#plans" }}
        />
    </div>
  );
}
