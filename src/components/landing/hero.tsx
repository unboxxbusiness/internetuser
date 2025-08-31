import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://picsum.photos/1920/1080')" }}
        data-ai-hint="network cables"
      >
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-48 text-white text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg">
          Experience the Future of Connectivity
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-200 drop-shadow">
          Gc Fiber Net delivers lightning-fast internet speeds and reliable service to keep you connected.
        </p>
        <Button 
          asChild 
          className="mt-8 h-12 px-6 text-base font-bold tracking-wide shadow-lg transform hover:scale-105 mx-auto"
          variant="accent"
        >
          <Link href="#plans">Explore Plans</Link>
        </Button>
      </div>
    </section>
  );
}
