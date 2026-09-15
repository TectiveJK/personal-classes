"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicApp, school, training } from "@/lib/config";
import { SchoolLogo } from "@/components/school-logo";

export function AuthHome() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 py-8 sm:max-w-5xl">
      <header className="text-center">
        <SchoolLogo className="mx-auto h-44 w-auto sm:h-56" priority />
        <p className="mt-4 text-sm text-muted-foreground">{school.center}</p>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          {training.title}: {training.focus}. Monday–Friday, {training.startLabel} to{" "}
          {training.endLabel}. Six places per session. Book any weekday this month.
        </p>
      </header>

      <IphoneInstallHint />

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

function IphoneInstallHint() {
  return (
    <div className="mt-8 rounded-2xl border border-gold/30 bg-card/80 px-4 py-4 text-left sm:text-center">
      <p className="text-xs tracking-[0.2em] text-gold uppercase">Open this address</p>
      <p className="mt-2 break-all font-medium text-foreground">{publicApp.origin}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Type that address in the phone’s browser. Old Home Screen icons from earlier links will say
        the website is not available — delete those icons and add this page again.
        <br />
        <span className="text-foreground">Android:</span> Chrome (not Instagram or Facebook) → type
        the address → menu (⋮) → Add to Home screen.
        <br />
        <span className="text-foreground">iPhone:</span> Safari (not Chrome) → Share → Add to Home
        Screen.
      </p>
    </div>
  );
}

function CreateAccountCard() {
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = new FormData(event.currentTarget);
    setPending(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(payload.get("stg-given") ?? ""),
          email: String(payload.get("stg-mail") ?? ""),
          phone: String(payload.get("stg-mobile") ?? ""),
          password: String(payload.get("stg-secret") ?? ""),
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not create the account.");
      toast.success("Account created. You can book a place now.");
      window.location.assign("/sessions");
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
        <form
          className="space-y-3"
          autoComplete="off"
          autoCorrect="off"
          onSubmit={(event) => void submit(event)}
        >
          <Field label="Full name" htmlFor="stg-given">
            <Input
              id="stg-given"
              name="stg-given"
              className="h-11"
              autoComplete="off"
              maxLength={80}
              required
            />
          </Field>
          <Field label="Email" htmlFor="stg-mail">
            <Input
              id="stg-mail"
              name="stg-mail"
              type="text"
              inputMode="email"
              className="h-11"
              autoComplete="off"
              maxLength={120}
              required
            />
          </Field>
          <Field label="Phone" htmlFor="stg-mobile">
            <Input
              id="stg-mobile"
              name="stg-mobile"
              type="tel"
              inputMode="tel"
              className="h-11"
              autoComplete="off"
              maxLength={20}
              required
            />
          </Field>
          <Field label="Password" htmlFor="stg-secret">
            <Input
              id="stg-secret"
              name="stg-secret"
              type="password"
              className="h-11"
              autoComplete="off"
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
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = new FormData(event.currentTarget);
    setPending(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(payload.get("signin-email") ?? ""),
          password: String(payload.get("signin-password") ?? ""),
        }),
      });
      const data = (await response.json()) as { error?: string; user?: { role: string } };
      if (!response.ok) throw new Error(data.error ?? "Could not sign in.");
      toast.success("Signed in.");
      window.location.assign(data.user?.role === "admin" ? "/admin" : "/sessions");
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
          <Field label="Email" htmlFor="signin-email">
            <Input
              id="signin-email"
              name="signin-email"
              type="text"
              inputMode="email"
              className="h-11"
              autoComplete="username"
              autoCapitalize="none"
              required
            />
          </Field>
          <Field label="Password" htmlFor="signin-password">
            <Input
              id="signin-password"
              name="signin-password"
              type="password"
              className="h-11"
              autoComplete="current-password"
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
