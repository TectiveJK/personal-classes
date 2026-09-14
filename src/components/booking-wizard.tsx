"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { disciplines, experienceLabels, getDiscipline } from "@/lib/school";
import { formatLongDate } from "@/lib/time";
import type { ExperienceLevel, Slot } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["Class", "Time", "Details", "Confirm"] as const;

export function BookingWizard({ initialDiscipline }: { initialDiscipline?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [disciplineSlug, setDisciplineSlug] = useState(
    initialDiscipline && disciplines.some((item) => item.slug === initialDiscipline)
      ? initialDiscipline
      : searchParams.get("class") &&
          disciplines.some((item) => item.slug === searchParams.get("class"))
        ? (searchParams.get("class") as string)
        : ""
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [slotId, setSlotId] = useState(searchParams.get("slot") ?? "");
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState<ExperienceLevel | "">("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingSlots(true);
      setSlotsError("");
      try {
        const response = await fetch("/api/slots");
        const data = (await response.json()) as { slots?: Slot[]; error?: string };
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load times.");
        }
        if (!cancelled) setSlots(data.slots ?? []);
      } catch (error) {
        if (!cancelled) {
          setSlotsError(error instanceof Error ? error.message : "Could not load times.");
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const discipline = getDiscipline(disciplineSlug);
  const selectedSlot = slots.find((slot) => slot.id === slotId);
  const datesWithAvailability = useMemo(() => {
    const set = new Set(
      slots.filter((slot) => slot.available).map((slot) => slot.date)
    );
    return set;
  }, [slots]);

  const timesForDate = useMemo(() => {
    if (!selectedDate) return [];
    const date = toDateKey(selectedDate);
    return slots.filter((slot) => slot.date === date);
  }, [selectedDate, slots]);

  function goNext() {
    if (step === 0 && !discipline) {
      toast.error("Choose a class type first.");
      return;
    }
    if (step === 1 && (!selectedSlot || !selectedSlot.available)) {
      toast.error("Choose an open time.");
      return;
    }
    if (step === 2) {
      if (studentName.trim().length < 2) {
        toast.error("Enter the student’s full name.");
        return;
      }
      if (!email.includes("@")) {
        toast.error("Enter a valid email address.");
        return;
      }
      if (phone.trim().length < 8) {
        toast.error("Enter a phone number we can reach.");
        return;
      }
      if (!experience) {
        toast.error("Select an experience level.");
        return;
      }
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  async function submit() {
    if (!discipline || !selectedSlot || !experience) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          disciplineSlug: discipline.slug,
          studentName,
          email,
          phone,
          experience,
          notes,
        }),
      });
      const data = (await response.json()) as {
        booking?: { code: string };
        error?: string;
      };
      if (!response.ok || !data.booking) {
        throw new Error(data.error ?? "Could not complete the booking.");
      }
      const stored = readLocalCodes();
      stored.unshift(data.booking.code);
      window.localStorage.setItem(
        "shaolin-booking-codes",
        JSON.stringify(stored.slice(0, 12))
      );
      toast.success("Session reserved.");
      router.push(`/book/confirm/${data.booking.code}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not book.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <ol className="grid grid-cols-4 gap-2 text-center text-xs tracking-[0.16em] uppercase">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={cn(
              "rounded-md border px-2 py-2",
              index === step
                ? "border-gold/50 bg-primary/15 text-gold"
                : index < step
                  ? "border-gold/20 text-foreground"
                  : "border-border text-muted-foreground"
            )}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {disciplines.map((item) => {
            const selected = item.slug === disciplineSlug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => setDisciplineSlug(item.slug)}
                className={cn(
                  "rounded-xl border p-5 text-left transition-colors",
                  selected
                    ? "border-gold/60 bg-primary/10"
                    : "border-border bg-card hover:border-gold/30"
                )}
              >
                <p className="text-xs tracking-[0.18em] text-gold uppercase">
                  {item.chinese}
                </p>
                <p className="font-heading mt-1 text-2xl">{item.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                <p className="mt-4 text-sm">
                  {item.durationMin} min · €{item.priceEur}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
          <div className="rounded-xl border border-border bg-card p-3">
            {loadingSlots ? (
              <p className="p-6 text-sm text-muted-foreground">Loading open times…</p>
            ) : slotsError ? (
              <p className="p-6 text-sm text-destructive">{slotsError}</p>
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSlotId("");
                }}
                disabled={(date) => {
                  const key = toDateKey(date);
                  const today = toDateKey(new Date());
                  return key < today || !datesWithAvailability.has(key);
                }}
              />
            )}
          </div>
          <div>
            <h2 className="font-heading text-2xl">
              {selectedDate ? formatLongDate(toDateKey(selectedDate)) : "Choose a day"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              One hall, one master. A reserved time is held for your session only.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {timesForDate.length === 0 ? (
                <p className="col-span-full text-sm text-muted-foreground">
                  Select a highlighted day to see times.
                </p>
              ) : (
                timesForDate.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSlotId(slot.id)}
                    className={cn(
                      "rounded-lg border px-3 py-3 text-sm",
                      !slot.available && "cursor-not-allowed opacity-40",
                      slot.available && slot.id === slotId
                        ? "border-gold/60 bg-primary/15 text-gold"
                        : slot.available
                          ? "border-border hover:border-gold/40"
                          : "border-border"
                    )}
                  >
                    {slot.time}
                    {!slot.available && (
                      <span className="mt-1 block text-[11px] tracking-wide uppercase">
                        Taken
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Student name" htmlFor="studentName">
            <Input
              id="studentName"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              autoComplete="name"
              className="h-10"
            />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="h-10"
            />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              className="h-10"
            />
          </Field>
          <Field label="Experience" htmlFor="experience">
            <Select
              value={experience || null}
              onValueChange={(value) =>
                setExperience((value as ExperienceLevel | null) ?? "")
              }
            >
              <SelectTrigger id="experience" className="h-10 w-full">
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(experienceLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="What do you want to work on?" htmlFor="notes">
              <Textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Injuries, previous styles, a form you want corrected, or a goal for this cycle."
              />
            </Field>
          </div>
        </div>
      )}

      {step === 3 && discipline && selectedSlot && (
        <div className="rounded-xl border border-gold/25 bg-card p-6">
          <p className="text-xs tracking-[0.2em] text-gold uppercase">Review</p>
          <h2 className="font-heading mt-2 text-3xl">{discipline.name}</h2>
          <p className="text-gold/80">{discipline.chinese}</p>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <Item label="When" value={`${formatLongDate(selectedSlot.date)} · ${selectedSlot.time}`} />
            <Item label="Duration" value={`${discipline.durationMin} minutes`} />
            <Item label="Fee" value={`€${discipline.priceEur}, paid at the hall`} />
            <Item label="Student" value={studentName} />
            <Item label="Email" value={email} />
            <Item label="Phone" value={phone} />
            <Item
              label="Experience"
              value={experienceLabels[experience] ?? experience}
            />
            {notes && <Item label="Notes" value={notes} />}
          </dl>
          <p className="mt-6 text-sm text-muted-foreground">
            Cancelling is free up to four hours before the session. Wear loose training
            clothes; shoes stay at the door.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          size="lg"
          disabled={step === 0 || submitting}
          onClick={() => setStep((current) => Math.max(0, current - 1))}
        >
          Back
        </Button>
        {discipline && (
          <Badge variant="outline" className="hidden sm:inline-flex">
            {discipline.name} · €{discipline.priceEur}
          </Badge>
        )}
        {step < 3 ? (
          <Button size="lg" onClick={goNext}>
            Continue
          </Button>
        ) : (
          <Button size="lg" onClick={() => void submit()} disabled={submitting}>
            {submitting ? "Reserving…" : "Confirm booking"}
          </Button>
        )}
      </div>
    </div>
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
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-[0.16em] text-gold uppercase">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readLocalCodes() {
  try {
    const raw = window.localStorage.getItem("shaolin-booking-codes");
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
