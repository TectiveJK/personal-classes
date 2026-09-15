import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AdminPanel } from "@/components/admin-panel";
import { AdminSignIn } from "@/components/admin-sign-in";
import { getSession } from "@/lib/auth";
import { findUserByEmail, findUserById, toPublicUser } from "@/lib/db";
import type { PublicUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) return <AdminSignIn />;
  if (session.role !== "admin") redirect("/sessions");
  const record = findUserById(session.sub) ?? findUserByEmail(session.email);
  const user: PublicUser = record
    ? toPublicUser(record)
    : {
        id: session.sub,
        name: session.name,
        email: session.email,
        phone: "",
        role: "admin",
        createdAt: new Date().toISOString(),
      };

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader user={user} />
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <p className="text-xs tracking-[0.2em] text-gold uppercase">Admin panel</p>
        <h1 className="font-heading mt-1 text-4xl">Bookings and students</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Live view of every Personal Training day this month. Each class holds six students.
          Add or delete student accounts on the Students tab. When a student books or cancels on
          their phone, this board updates immediately.
        </p>
        <div className="mt-8">
          <AdminPanel />
        </div>
      </div>
    </div>
  );
}
