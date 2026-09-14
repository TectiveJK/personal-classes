"use client";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { training } from "@/lib/config";
import { formatLongDate } from "@/lib/time";
import { useLiveSessions } from "@/components/use-live-sessions";
import type { SessionView } from "@/lib/types";

export function SessionBoard() {
  const { sessions, loading, error, setSessions } = useLiveSessions();

  async function book(date: string) {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    const data = (await response.json()) as { sessions?: SessionView[]; error?: string };
    if (!response.ok) {
      toast.error(data.error ?? "Could not reserve a place.");
      return;
    }
    setSessions(data.sessions ?? []);
    toast.success("Your place is reserved.");
  }

  async function cancel(date: string) {
    const response = await fetch("/api/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    const data = (await response.json()) as { sessions?: SessionView[]; error?: string };
    if (!response.ok) {
      toast.error(data.error ?? "Could not release your place.");
      return;
    }
    setSessions(data.sessions ?? []);
    toast.success("Your place is released.");
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading this week’s sessions…</p>;
  }
  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {training.title} · {training.focus}. Each session holds {training.capacity} students.
        Numbers update live for everyone signed in.
      </p>
      <ul className="space-y-3">
        {sessions.map((session) => (
          <li
            key={session.date}
            className="rounded-2xl border border-border bg-card/80 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.18em] text-gold uppercase">{session.weekday}</p>
                <h2 className="font-heading text-2xl">{formatLongDate(session.date)}</h2>
                <p className="mt-1 text-sm">
                  {session.startLabel} to {session.endLabel}
                </p>
              </div>
              <Status session={session} />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary"
                style={{ width: `${(session.booked / session.capacity) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {session.booked} of {session.capacity} places booked
              {session.full
                ? " · Fully booked"
                : ` · ${session.remaining} ${session.remaining === 1 ? "place" : "places"} remaining`}
            </p>
            <div className="mt-4">
              {session.past ? (
                <Button className="h-11 w-full sm:w-auto" disabled>
                  Session started
                </Button>
              ) : session.mine ? (
                <Button
                  className="h-11 w-full sm:w-auto"
                  variant="outline"
                  onClick={() => void cancel(session.date)}
                >
                  Cancel my place
                </Button>
              ) : session.full ? (
                <Button className="h-11 w-full sm:w-auto" disabled>
                  Fully booked
                </Button>
              ) : (
                <Button className="h-11 w-full sm:w-auto" onClick={() => void book(session.date)}>
                  Reserve a place
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Status({ session }: { session: SessionView }) {
  if (session.mine) return <Badge>Your place</Badge>;
  if (session.full) return <Badge variant="secondary">Full</Badge>;
  if (session.past) return <Badge variant="outline">Past</Badge>;
  return <Badge variant="outline">{session.remaining} left</Badge>;
}
