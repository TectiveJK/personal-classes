import { training } from "@/lib/config";
import { findUserById, getDb, toPublicUser } from "@/lib/db";
import { notifyBookingsChanged } from "@/lib/realtime";
import { sessionHasStarted, upcomingSessionDates, weekdayName } from "@/lib/time";
import type { BookingRow, SessionView } from "@/lib/types";

type BookingRecord = {
  id: string;
  user_id: string;
  session_date: string;
  created_at: string;
};

export function listSessionViews(userId?: string): SessionView[] {
  const db = getDb();
  const counts = new Map<string, number>();
  const mine = new Set<string>();
  const rows = db.prepare("SELECT session_date, user_id FROM bookings").all() as {
    session_date: string;
    user_id: string;
  }[];
  for (const row of rows) {
    counts.set(row.session_date, (counts.get(row.session_date) ?? 0) + 1);
    if (userId && row.user_id === userId) mine.add(row.session_date);
  }

  return upcomingSessionDates().map((date) => {
    const booked = counts.get(date) ?? 0;
    const remaining = Math.max(0, training.capacity - booked);
    const past = sessionHasStarted(date);
    return {
      date,
      weekday: weekdayName(date),
      start: training.start,
      end: training.end,
      startLabel: training.startLabel,
      endLabel: training.endLabel,
      booked,
      remaining,
      capacity: training.capacity,
      full: remaining === 0,
      past,
      mine: mine.has(date),
    };
  });
}

export function createBooking(userId: string, sessionDate: string) {
  if (!upcomingSessionDates().includes(sessionDate)) {
    throw Object.assign(new Error("That session is not on the board."), { status: 400 });
  }
  if (sessionHasStarted(sessionDate)) {
    throw Object.assign(new Error("That session has already started."), { status: 400 });
  }

  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  try {
    const already = db
      .prepare("SELECT id FROM bookings WHERE user_id = ? AND session_date = ?")
      .get(userId, sessionDate) as { id: string } | undefined;
    if (already) {
      throw Object.assign(new Error("You already have a place in this session."), { status: 409 });
    }
    const taken = (
      db.prepare("SELECT COUNT(*) AS n FROM bookings WHERE session_date = ?").get(sessionDate) as {
        n: number;
      }
    ).n;
    if (taken >= training.capacity) {
      throw Object.assign(new Error("This session is fully booked."), { status: 409 });
    }
    const booking: BookingRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      session_date: sessionDate,
      created_at: new Date().toISOString(),
    };
    db.prepare(
      "INSERT INTO bookings (id, user_id, session_date, created_at) VALUES (?, ?, ?, ?)"
    ).run(booking.id, booking.user_id, booking.session_date, booking.created_at);
    db.exec("COMMIT");
    notifyBookingsChanged();
    return booking;
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* no open transaction */
    }
    throw error;
  }
}

export function cancelBooking(bookingId: string, actor: { sub: string; role: string }) {
  const db = getDb();
  const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId) as
    | BookingRecord
    | undefined;
  if (!booking) {
    throw Object.assign(new Error("Booking not found."), { status: 404 });
  }
  if (actor.role !== "admin" && booking.user_id !== actor.sub) {
    throw Object.assign(new Error("You can only cancel your own place."), { status: 403 });
  }
  if (actor.role !== "admin" && sessionHasStarted(booking.session_date)) {
    throw Object.assign(new Error("That session has already started."), { status: 400 });
  }
  db.prepare("DELETE FROM bookings WHERE id = ?").run(bookingId);
  notifyBookingsChanged();
  return booking;
}

export function cancelMine(userId: string, sessionDate: string) {
  const db = getDb();
  const booking = db
    .prepare("SELECT * FROM bookings WHERE user_id = ? AND session_date = ?")
    .get(userId, sessionDate) as BookingRecord | undefined;
  if (!booking) {
    throw Object.assign(new Error("You do not have a place in this session."), { status: 404 });
  }
  return cancelBooking(booking.id, { sub: userId, role: "student" });
}

export function listBookings(): BookingRow[] {
  const rows = getDb()
    .prepare("SELECT * FROM bookings ORDER BY session_date ASC, created_at ASC")
    .all() as BookingRecord[];
  return rows.flatMap((row) => {
    const user = findUserById(row.user_id);
    if (!user) return [];
    return [
      {
        id: row.id,
        sessionDate: row.session_date,
        weekday: weekdayName(row.session_date),
        startLabel: training.startLabel,
        endLabel: training.endLabel,
        createdAt: row.created_at,
        student: toPublicUser(user),
      },
    ];
  });
}

export function myBookings(userId: string) {
  return listBookings().filter((row) => row.student.id === userId);
}
