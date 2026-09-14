"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SchoolLogo } from "@/components/school-logo";
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
        <Link
          href={user.role === "admin" ? "/admin" : "/sessions"}
          className="flex min-w-0 items-center gap-3"
        >
          <SchoolLogo className="h-12 w-auto shrink-0" />
          <span className="min-w-0 leading-tight">
            <span className="font-heading block truncate text-lg">{school.name}</span>
            <span className="block text-[11px] tracking-[0.14em] text-gold uppercase">
              Personal Training
            </span>
          </span>
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
