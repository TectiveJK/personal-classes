"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { school } from "@/lib/config";
import { SchoolLogo } from "@/components/school-logo";

export function AdminSignIn() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = new FormData(event.currentTarget);
    setPending(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(payload.get("admin-email") ?? ""),
          password: String(payload.get("admin-password") ?? ""),
        }),
      });
      const data = (await response.json()) as { error?: string; user?: { role: string } };
      if (!response.ok) throw new Error(data.error ?? "Could not sign in.");
      if (data.user?.role !== "admin") {
        throw new Error("This page is for the administrator only.");
      }
      toast.success("Admin signed in.");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-10">
      <SchoolLogo className="mx-auto h-32 w-auto" priority />
      <Card className="mt-8 border-gold/30">
        <CardHeader>
          <p className="text-xs tracking-[0.2em] text-gold uppercase">Admin panel</p>
          <CardTitle className="font-heading text-3xl">Centre administrator</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to see every Personal Training booking, student profile, and remaining places.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={(event) => void submit(event)}>
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Admin email</Label>
              <Input
                id="admin-email"
                name="admin-email"
                type="text"
                inputMode="email"
                className="h-11"
                autoComplete="username"
                autoCapitalize="none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                name="admin-password"
                type="password"
                className="h-11"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="h-11 w-full" disabled={pending}>
              {pending ? "Signing in…" : "Open admin panel"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-xs text-muted-foreground">{school.address}</p>
    </div>
  );
}
