import { addDays, athensNow, minutesBetween, slotId, weekdayIndex, weekdayName } from "@/lib/time";
import type { Slot } from "@/lib/types";

const WEEKDAY_TIMES: Record<number, string[]> = {
  0: [],
  1: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
  2: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
  3: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
  4: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
  5: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
  6: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "16:00", "17:00", "18:00", "19:00"],
};

const HORIZON_DAYS = 21;
const MIN_NOTICE_MINUTES = 240;

export function generateOpenSlots(takenIds: Set<string>, now = new Date()): Slot[] {
  const today = athensNow(now).date;
  const slots: Slot[] = [];

  for (let offset = 0; offset < HORIZON_DAYS; offset += 1) {
    const date = addDays(today, offset);
    const times = WEEKDAY_TIMES[weekdayIndex(date)] ?? [];
    for (const time of times) {
      const id = slotId(date, time);
      const tooSoon = minutesBetween(date, time, now) < MIN_NOTICE_MINUTES;
      slots.push({
        id,
        date,
        time,
        weekday: weekdayName(date),
        available: !tooSoon && !takenIds.has(id),
      });
    }
  }

  return slots;
}

export function groupSlotsByDate(slots: Slot[]) {
  const groups = new Map<string, Slot[]>();
  for (const slot of slots) {
    const list = groups.get(slot.date) ?? [];
    list.push(slot);
    groups.set(slot.date, list);
  }
  return groups;
}
