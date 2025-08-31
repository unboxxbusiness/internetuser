import { Hero } from "@/components/landing/hero";
import { Offers } from "@/components/landing/offers";
import { CTA } from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1">
        <Hero />
        <Offers />
        <CTA />
      </main>
    </div>
  );
}
