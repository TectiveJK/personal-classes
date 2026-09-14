import type { Metadata } from "next";
import { WeekSchedule } from "@/components/week-schedule";
import { listSlots } from "@/lib/store";
import { school } from "@/lib/school";

export const metadata: Metadata = {
  title: "Schedule",
};

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const slots = await listSlots();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-gold uppercase">Board</p>
      <h1 className="font-heading mt-2 text-5xl">Open private hours</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Times are in {school.timezone}. A struck-through hour is already held. Tap an open time
        to start a booking. {school.hoursNote}
      </p>
      <div className="mt-10">
        <WeekSchedule slots={slots} />
      </div>
    </div>
  );
}
