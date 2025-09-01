import { redirect } from "next/navigation";
import { getUser } from "./auth/actions";

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
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1">
        
      </main>
    </div>
  );
}
