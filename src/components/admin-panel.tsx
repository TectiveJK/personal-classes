"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatLongDate } from "@/lib/time";
import type { BookingRow, PublicUser, SessionView } from "@/lib/types";

type Overview = {
  sessions: SessionView[];
  bookings: BookingRow[];
  students: PublicUser[];
};

export function AdminPanel() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/overview", { cache: "no-store" });
      const payload = (await response.json()) as Overview & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not load the board.");
      setData(payload);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the board.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const source = new EventSource("/api/events");
    source.onopen = () => {
      void reload();
    };
    source.onmessage = () => {
      void reload();
    };
    const poll = setInterval(() => void reload(), 4000);
    return () => {
      source.close();
      clearInterval(poll);
    };
  }, [reload]);

  async function removeBooking(id: string) {
    const response = await fetch("/api/admin/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const payload = (await response.json()) as Partial<Overview> & { error?: string };
    if (!response.ok) {
      toast.error(payload.error ?? "Could not cancel that booking.");
      return;
    }
    setData((current) =>
      current
        ? {
            ...current,
            sessions: payload.sessions ?? current.sessions,
            bookings: payload.bookings ?? current.bookings,
          }
        : current
    );
    toast.success("Place released.");
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading the admin board…</p>;
  if (error || !data) return <p className="text-sm text-destructive">{error || "No data."}</p>;

  return (
    <Tabs defaultValue="sessions">
      <TabsList className="h-auto w-full max-w-full flex-wrap">
        <TabsTrigger value="sessions" className="px-3 py-2">
          Sessions
        </TabsTrigger>
        <TabsTrigger value="bookings" className="px-3 py-2">
          Bookings
        </TabsTrigger>
        <TabsTrigger value="students" className="px-3 py-2">
          Students
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sessions" className="mt-5">
        <div className="grid gap-3">
          {data.sessions.map((session) => (
            <article key={session.date} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-heading text-xl">
                    {session.weekday} · {formatLongDate(session.date)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {session.startLabel}–{session.endLabel}
                  </p>
                </div>
                <Badge variant={session.full ? "secondary" : "outline"}>
                  {session.booked}/{session.capacity} occupied · {session.remaining} free
                </Badge>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(session.booked / session.capacity) * 100}%` }}
                />
              </div>
              <ul className="mt-3 text-sm">
                {data.bookings
                  .filter((booking) => booking.sessionDate === session.date)
                  .map((booking) => (
                    <li key={booking.id} className="py-1 text-muted-foreground">
                      {booking.student.name} · {booking.student.email} · {booking.student.phone}
                    </li>
                  ))}
                {session.booked === 0 && (
                  <li className="text-muted-foreground">No students booked yet.</li>
                )}
              </ul>
            </article>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="bookings" className="mt-5">
        {data.bookings.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No bookings yet. When a student reserves a place, it appears here immediately.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.student.name}</TableCell>
                  <TableCell>
                    {booking.weekday}
                    <div className="text-xs text-muted-foreground">
                      {formatLongDate(booking.sessionDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.startLabel}–{booking.endLabel}
                  </TableCell>
                  <TableCell>
                    {booking.student.email}
                    <div className="text-xs text-muted-foreground">{booking.student.phone}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void removeBooking(booking.id)}
                    >
                      Release
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TabsContent>

      <TabsContent value="students" className="mt-5">
        {data.students.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No student accounts yet. New accounts created on the home screen appear here.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Places held</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    {data.bookings.filter((booking) => booking.student.id === student.id).length}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(student.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TabsContent>
    </Tabs>
  );
}
