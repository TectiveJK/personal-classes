"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { disciplines, experienceLabels } from "@/lib/school";
import { formatLongDate } from "@/lib/time";
import type { Booking } from "@/lib/types";

export function BookingsLookup() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [emptyMessage, setEmptyMessage] = useState("");

  async function lookup(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setEmptyMessage("");
    try {
      const query = code.trim()
        ? `code=${encodeURIComponent(code.trim())}`
        : `email=${encodeURIComponent(email.trim())}`;
      if (!code.trim() && !email.trim()) {
        toast.error("Enter an email or a confirmation code.");
        return;
      }
      const response = await fetch(`/api/bookings?${query}`);
      const data = (await response.json()) as { bookings?: Booking[]; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "No bookings found.");
      }
      const list = data.bookings ?? [];
      setBookings(list);
      if (list.length === 0) {
        setEmptyMessage("No sessions match that lookup.");
      }
    } catch (error) {
      setBookings([]);
      setEmptyMessage(error instanceof Error ? error.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  async function cancel(bookingCode: string) {
    setCancelling(bookingCode);
    try {
      const response = await fetch(`/api/bookings/${bookingCode}`, { method: "DELETE" });
      const data = (await response.json()) as { booking?: Booking; error?: string };
      if (!response.ok || !data.booking) {
        throw new Error(data.error ?? "Could not cancel.");
      }
      setBookings((current) =>
        (current ?? []).map((item) => (item.code === bookingCode ? data.booking! : item))
      );
      toast.success("Session released back to the board.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel.");
    } finally {
      setCancelling(null);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={(event) => void lookup(event)} className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">Confirmation code</Label>
          <Input
            id="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="SL-A1B2C3"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Or email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="h-10"
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Searching…" : "Find sessions"}
          </Button>
        </div>
      </form>

      {bookings && bookings.length === 0 && (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          {emptyMessage || "No sessions match that lookup."} If you just booked, wait a
          moment and try the confirmation code from your receipt.
        </p>
      )}

      {bookings && bookings.length > 0 && (
        <ul className="space-y-4">
          {bookings.map((booking) => {
            const discipline = disciplines.find((item) => item.slug === booking.disciplineSlug);
            return (
              <li
                key={booking.code}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-2xl">{discipline?.name ?? "Private session"}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatLongDate(booking.date)} · {booking.time}
                    </p>
                    <p className="mt-2 font-mono text-sm text-gold">{booking.code}</p>
                  </div>
                  <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {booking.studentName} · {experienceLabels[booking.experience]}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" render={<Link href={`/book/confirm/${booking.code}`} />}>
                    Open receipt
                  </Button>
                  {booking.status === "confirmed" && (
                    <Button
                      variant="destructive"
                      disabled={cancelling === booking.code}
                      onClick={() => void cancel(booking.code)}
                    >
                      {cancelling === booking.code ? "Releasing…" : "Cancel session"}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
