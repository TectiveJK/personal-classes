import { redirect } from "next/navigation";
import { AuthHome } from "@/components/auth-home";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export default async function HomePage() {
  getDb();
  const session = await getSession();
  if (session?.role === "admin") redirect("/admin");
  if (session) redirect("/sessions");
  return <AuthHome />;
}
