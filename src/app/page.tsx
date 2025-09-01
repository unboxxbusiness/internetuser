
import { redirect } from "next/navigation";
import { getUser } from "./auth/actions";
import { HeroGeometric } from "@/components/hero-geometric";


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
    <HeroGeometric 
        badge="Gc Fiber Net"
        title1="Seamless Connectivity"
        title2="Unmatched Speeds"
    />
  );
}
