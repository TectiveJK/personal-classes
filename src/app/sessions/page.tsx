import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { SessionBoard } from "@/components/session-board";
import { getSession } from "@/lib/auth";
import { findUserById, toPublicUser } from "@/lib/db";
import { training } from "@/lib/config";
import { currentMonthLabel } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const session = await getSession();
  if (!session) redirect("/");
  if (session.role === "admin") redirect("/admin");
  const user = findUserById(session.sub);
  if (!user) redirect("/");

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader user={toPublicUser(user)} />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <p className="text-xs tracking-[0.2em] text-gold uppercase">{training.title}</p>
        <h1 className="font-heading mt-1 text-4xl">{currentMonthLabel()}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every Monday–Friday this month, {training.startLabel}–{training.endLabel}. Six places each
          day.
        </p>
        <div className="mt-6">
          <SessionBoard />
        </div>
      </div>
    </div>
  );
}
