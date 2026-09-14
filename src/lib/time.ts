import { school, training, WEEKDAY_NAMES } from "@/lib/config";

function athensParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: school.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

export function athensToday() {
  return athensParts().date;
}

export function weekdayIndex(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
}

export function weekdayName(date: string) {
  return WEEKDAY_NAMES[weekdayIndex(date)];
}

export function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

export function formatLongDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function sessionHasStarted(date: string, now = new Date()) {
  const current = athensParts(now);
  if (date < current.date) return true;
  if (date > current.date) return false;
  return current.time >= training.start;
}

export function upcomingSessionDates(now = new Date()) {
  const today = athensParts(now).date;
  const dates: string[] = [];
  for (let offset = 0; offset < training.horizonDays; offset += 1) {
    const date = addDays(today, offset);
    if ((training.weekdayIndexes as readonly number[]).includes(weekdayIndex(date))) {
      dates.push(date);
    }
  }
  return dates;
}
