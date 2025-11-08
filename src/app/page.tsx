
import { redirect } from "next/navigation";
import { getUser } from "./auth/actions";
import { getPlans } from "@/lib/firebase/server-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Phone, Zap, MessageCircle, DollarSign, Signal, MapPin, Star, Wifi } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
    },
    {
        quote: "Finally, no buffering! My kids love it for online classes.",
        author: "Suman R.",
    },
    {
        quote: "Affordable and honest service — way better than big companies.",
        author: "Deepak M.",
    }
]

const footerTrustPoints = [
    "Locally owned ISP serving Aali Village & South Delhi",
    "24/7 customer support",
    "Easy online payments",
    "No contracts, no hidden fees"
]

export default async function LandingPage() {
  const user = await getUser();

  if (user) {
    if (user.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/user/dashboard");
    }
  }

  const plans = await getPlans();
  const displayPlans = plans.slice(0, 4); // Take first 4 for the table

  return (
    <div className="bg-background text-foreground">
      {/* 1. Hero Section */}
      <section className="relative bg-muted dark:bg-background/40 py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Fast. Reliable. Local Internet for <span className="text-primary">Aali Village, Delhi.</span></h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                  Experience smooth streaming, lag-free gaming, and dependable connectivity — powered by your trusted local ISP right here in Aali Village.
              </p>
              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                  <Button size="lg" asChild>
                      <Link href="/auth/signup">🚀 Check Availability in Aali Village</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                      <a href="tel:9999999999">📞 Call Now – Get Connected Today</a>
                  </Button>
              </div>
          </div>
          <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.1] [mask-image:linear-gradient(to_bottom,white,transparent)] -z-10"></div>
      </section>

      {/* 2. Why Choose Us */}
      <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">Why Aali Village Chooses Us for Internet That Works</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                  {whyChooseUsPoints.map((point) => (
                      <div key={point.title} className="text-center flex flex-col items-center">
                          <div className="mb-4">{point.icon}</div>
                          <h3 className="text-lg font-semibold">{point.title}</h3>
                          <p className="mt-1 text-muted-foreground text-sm">{point.description}</p>
                      </div>
                  ))}
              </div>
              <div className="text-center mt-12">
                  <Button variant="outline" asChild>
                      <Link href="/user/plans">✨ View Internet Plans</Link>
                  </Button>
              </div>
          </div>
      </section>

      {/* 3. Plans & Pricing */}
      <section className="py-16 md:py-24 bg-muted dark:bg-background/40">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">Choose a Plan That Fits Your Lifestyle</h2>
                   <Badge variant="secondary" className="mt-4 text-sm">No setup fee for new connections in Aali Village this month!</Badge>
              </div>
              <Card className="max-w-4xl mx-auto">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plan</TableHead>
                        <TableHead>Speed</TableHead>
                        <TableHead>Ideal For</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayPlans.map(plan => (
                          <TableRow key={plan.id}>
                              <TableCell className="font-medium">{plan.name}</TableCell>
                              <TableCell>Up to {plan.speed} Mbps</TableCell>
                              <TableCell>
                                {plan.speed <= 50 ? "Browsing, YouTube, WhatsApp" :
                                plan.speed <= 150 ? "Families, HD streaming" :
                                plan.speed <= 300 ? "Work from home, gamers" :
                                "Businesses, multi-device homes"}
                              </TableCell>
                              <TableCell className="text-right font-bold">₹{plan.price}/mo</TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="text-center mt-12">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">🚀 Get Connected Today</Link>
                </Button>
              </div>
          </div>
      </section>

      {/* 4. Coverage Map */}
      <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                      <h2 className="text-3xl md:text-4xl font-bold">Now Available Across Aali Village and Nearby Areas</h2>
                      <p className="mt-4 text-lg text-muted-foreground">
                          We’re proud to serve homes and businesses in Aali Village, Jasola, Sarita Vihar, and nearby localities.
                      </p>
                       <Button className="mt-6" asChild>
                            <Link href="/auth/signup">📍 Check Coverage</Link>
                       </Button>
                  </div>
                  <div className="bg-muted rounded-lg h-80 flex items-center justify-center">
                      <p className="text-muted-foreground">[Placeholder for Coverage Map]</p>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. Testimonials */}
       <section className="py-16 md:py-24 bg-muted dark:bg-background/40">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">What Your Neighbors Are Saying</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index}>
                            <CardContent className="pt-6">
                                <div className="flex mb-2">
                                    {[...Array(5)].map(i => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <p className="text-foreground">“{testimonial.quote}”</p>
                                <p className="mt-4 font-semibold text-right">- {testimonial.author}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-12">
                     <Button variant="outline" asChild>
                      <Link href="#">⭐ Read More Local Reviews</Link>
                  </Button>
                </div>
            </div>
       </section>

        {/* 6. Final CTA */}
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Ready for Faster Internet in Aali Village?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                   Join hundreds of happy local customers already connected with us. Setup takes less than 24 hours.
                </p>
                <div className="mt-8 flex justify-center gap-4 flex-wrap">
                    <Button size="lg" asChild>
                        <Link href="/auth/signup">✅ Check Availability</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <a href="tel:9999999999">📞 Call 9999-XXX-XXX for Instant Support</a>
                    </Button>
                </div>
            </div>
        </section>

        {/* 7. Footer Trust Section */}
        <div className="py-8 bg-secondary text-secondary-foreground">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {footerTrustPoints.map(point => (
                         <div key={point} className="flex items-center justify-center gap-2 text-sm font-medium">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>{point}</span>
                         </div>
                    ))}
                </div>
            </div>
        </div>

    </div>
  );
}

    