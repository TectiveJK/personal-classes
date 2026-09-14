"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { school } from "@/lib/config";
import type { PublicUser } from "@/lib/types";

export function AppHeader({ user }: { user: PublicUser }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href={user.role === "admin" ? "/admin" : "/sessions"} className="min-w-0">
          <p className="font-heading truncate text-lg leading-tight">{school.name}</p>
          <p className="font-seal text-[11px] tracking-[0.18em] text-gold">
            {school.chinese} · {school.center}
          </p>
        </Link>
        <nav className="flex items-center gap-2">
          {user.role === "admin" ? (
            <Button variant="outline" size="sm" render={<Link href="/admin" />}>
              Admin
            </Button>
          ) : (
            <Button variant="outline" size="sm" render={<Link href="/account" />}>
              Profile
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => void logout()}>
            Sign out
          </Button>
        </nav>
      </div>
    </header>
  );
}
