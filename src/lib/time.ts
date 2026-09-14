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

export function currentMonthLabel(now = new Date()) {
  const today = athensParts(now).date;
  const [year, month] = today.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function mondayOf(date: string) {
  const index = weekdayIndex(date);
  const delta = index === 0 ? -6 : 1 - index;
  return addDays(date, delta);
}

export function formatWeekHeading(monday: string) {
  const [year, month, day] = monday.split("-").map(Number);
  const label = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
  return `Week of ${label}`;
}

export function boardSessionDates(now = new Date()) {
  const today = athensParts(now).date;
  const [year, month] = today.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const dates: string[] = [];
  for (let day = 1; day <= lastDay; day += 1) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if ((training.weekdayIndexes as readonly number[]).includes(weekdayIndex(date))) {
      dates.push(date);
    }
  }
  return dates;
}

export function upcomingSessionDates(now = new Date()) {
  return boardSessionDates(now);
}

export function groupByWeek<T extends { date: string }>(items: T[]) {
  const groups: { monday: string; items: T[] }[] = [];
  for (const item of items) {
    const monday = mondayOf(item.date);
    const last = groups.at(-1);
    if (last && last.monday === monday) last.items.push(item);
    else groups.push({ monday, items: [item] });
  }
  return groups;
}
