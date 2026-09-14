"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { school, training } from "@/lib/config";
import { SchoolLogo } from "@/components/school-logo";

export function AuthHome() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 py-8 sm:max-w-5xl">
      <header className="text-center">
        <SchoolLogo className="mx-auto h-44 w-auto sm:h-56" priority />
        <p className="mt-4 text-sm text-muted-foreground">{school.center}</p>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          {training.title}: {training.focus}. Monday–Friday, {training.startLabel} to{" "}
          {training.endLabel}. Five places per session.
        </p>
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <CreateAccountCard />
        <SignInCard />
      </div>

      <p className="mt-auto pt-10 text-center text-xs text-muted-foreground">
        {school.address}
        <br />
        <a className="text-gold" href={school.website} target="_blank" rel="noreferrer">
          {school.websiteLabel}
        </a>
      </p>
    </div>
  );
}

function CreateAccountCard() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not create the account.");
      toast.success("Account created. You can book a place now.");
      router.push("/sessions");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the account.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="border-gold/30 bg-card/80">
      <CardHeader>
        <p className="text-xs tracking-[0.2em] text-gold uppercase">Home screen</p>
        <CardTitle className="font-heading text-2xl">Create account</CardTitle>
        <p className="text-sm text-muted-foreground">
          You need an account before you can reserve a place.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={(event) => void submit(event)}>
          <Field label="Full name" htmlFor="name">
            <Input
              id="name"
              className="h-11"
              autoComplete="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </Field>
          <Field label="Email" htmlFor="reg-email">
            <Input
              id="reg-email"
              type="email"
              className="h-11"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input
              id="phone"
              type="tel"
              className="h-11"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              required
            />
          </Field>
          <Field label="Password" htmlFor="reg-password">
            <Input
              id="reg-password"
              type="password"
              className="h-11"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              minLength={8}
            />
          </Field>
          <Button type="submit" className="h-11 w-full" disabled={pending}>
            {pending ? "Creating…" : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SignInCard() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string; user?: { role: string } };
      if (!response.ok) throw new Error(data.error ?? "Could not sign in.");
      toast.success("Signed in.");
      router.push(data.user?.role === "admin" ? "/admin" : "/sessions");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-xs tracking-[0.2em] text-gold uppercase">Returning student</p>
        <CardTitle className="font-heading text-2xl">Sign in</CardTitle>
        <p className="text-sm text-muted-foreground">
          Use the email and password from your account.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={(event) => void submit(event)}>
          <Field label="Email" htmlFor="login-email">
            <Input
              id="login-email"
              type="email"
              className="h-11"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </Field>
          <Field label="Password" htmlFor="login-password">
            <Input
              id="login-password"
              type="password"
              className="h-11"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </Field>
          <Button type="submit" variant="outline" className="h-11 w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
