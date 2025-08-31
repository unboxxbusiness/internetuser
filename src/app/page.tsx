import { HeroSection } from "@/components/landing/new-hero";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  );
}
