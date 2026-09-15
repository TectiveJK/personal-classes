export const school = {
  name: "Shaolin Temple Greece",
  chinese: "希腊少林寺",
  center: "Cultural Center",
  website: "https://www.shaolintemplegreece.com",
  websiteLabel: "www.shaolintemplegreece.com",
  email: "info@shaolintemplegreece.com",
  phone: "+30 211 267 2597",
  address: "77 Dodonis Street, 10444 Athens",
  timezone: "Europe/Athens",
} as const;

/** Public HTTPS origin phones and the admin computer should open. */
export const publicApp = {
  origin: "https://shaolin-pt.vercel.app",
  student: "https://shaolin-pt.vercel.app/",
  admin: "https://shaolin-pt.vercel.app/admin",
} as const;

export const training = {
  title: "Personal Training",
  focus: "Strength and conditioning · Self-defense",
  start: "20:30",
  end: "21:30",
  startLabel: "8:30 PM",
  endLabel: "9:30 PM",
  capacity: 6,
  weekdayIndexes: [1, 2, 3, 4, 5],
} as const;

export const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
