
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "./auth/actions";
import { getHeroSettings } from "@/lib/firebase/server-actions";
import { Button } from "@/components/ui/button";

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
              data-ai-hint="internet technology"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>
  );
}


