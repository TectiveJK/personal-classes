import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatShortDate } from "@/lib/time";
import { groupSlotsByDate } from "@/lib/slots";
import type { Slot } from "@/lib/types";
import { cn } from "@/lib/utils";

export function WeekSchedule({ slots }: { slots: Slot[] }) {
  const grouped = [...groupSlotsByDate(slots).entries()].slice(0, 14);

  if (grouped.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">
        No private times are on the board right now. Call the hall and we will open a session.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {grouped.map(([date, daySlots]) => {
        const open = daySlots.filter((slot) => slot.available).length;
        return (
          <section
            key={date}
            className="rounded-xl border border-border bg-card/70 p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-xl">{formatShortDate(date)}</h2>
              <Badge variant={open ? "outline" : "secondary"}>
                {open ? `${open} open` : "Full"}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {daySlots.map((slot) =>
                slot.available ? (
                  <Link
                    key={slot.id}
                    href={`/book?slot=${slot.id}`}
                    className="rounded-md border border-gold/25 px-3 py-1.5 text-sm hover:border-gold/60 hover:bg-primary/10"
                  >
                    {slot.time}
                  </Link>
                ) : (
                  <span
                    key={slot.id}
                    className={cn(
                      "rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground line-through"
                    )}
                  >
                    {slot.time}
                  </span>
                )
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
