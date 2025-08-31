import { getUser } from "./auth/actions";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const user = await getUser();

  if (user) {
    const redirectTo = user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
    redirect(redirectTo);
  }

  redirect("/auth/login");
}
