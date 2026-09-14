import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { primaryInstructor } from "@/lib/school";
import { generateOpenSlots } from "@/lib/slots";
import type { Booking, CreateBookingInput } from "@/lib/types";

const DATA_DIR =
  process.env.BOOKINGS_DIR ??
  (process.env.VERCEL ? "/tmp" : path.join(process.cwd(), ".data"));
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

type StoreFile = {
  bookings: Booking[];
};

let writeChain: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>) {
  const run = writeChain.then(task, task);
  writeChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    return { bookings: parsed.bookings ?? [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { bookings: [] };
    }
    throw error;
  }
}

async function writeStore(store: StoreFile) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

function makeCode() {
  return `SL-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function listSlots() {
  const store = await readStore();
  const taken = new Set(
    store.bookings
      .filter((booking) => booking.status === "confirmed")
      .map((booking) => booking.slotId)
  );
  return generateOpenSlots(taken);
}

export async function createBooking(input: CreateBookingInput) {
  return enqueue(async () => {
    const store = await readStore();
    const taken = new Set(
      store.bookings
        .filter((booking) => booking.status === "confirmed")
        .map((booking) => booking.slotId)
    );
    const slot = generateOpenSlots(taken).find((item) => item.id === input.slotId);

    if (!slot || !slot.available) {
      throw Object.assign(new Error("That time is no longer available."), {
        status: 409,
      });
    }

    const booking: Booking = {
      code: makeCode(),
      slotId: slot.id,
      date: slot.date,
      time: slot.time,
      disciplineSlug: input.disciplineSlug,
      instructorId: primaryInstructor.id,
      studentName: input.studentName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      experience: input.experience,
      notes: input.notes?.trim() ?? "",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    store.bookings.push(booking);
    await writeStore(store);
    return booking;
  });
}

export async function findBooking(code: string) {
  const store = await readStore();
  return (
    store.bookings.find(
      (booking) => booking.code.toUpperCase() === code.trim().toUpperCase()
    ) ?? null
  );
}

export async function findBookingsByEmail(email: string) {
  const store = await readStore();
  const needle = email.trim().toLowerCase();
  return store.bookings
    .filter((booking) => booking.email === needle)
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
}

export async function cancelBooking(code: string) {
  return enqueue(async () => {
    const store = await readStore();
    const booking = store.bookings.find(
      (item) => item.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (!booking) {
      throw Object.assign(new Error("No booking found for that code."), {
        status: 404,
      });
    }
    if (booking.status === "cancelled") {
      return booking;
    }
    booking.status = "cancelled";
    await writeStore(store);
    return booking;
  });
}
