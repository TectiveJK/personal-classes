export type Role = "student" | "admin";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
};

export type SessionView = {
  date: string;
  weekday: string;
  start: string;
  end: string;
  startLabel: string;
  endLabel: string;
  booked: number;
  remaining: number;
  capacity: number;
  full: boolean;
  past: boolean;
  mine: boolean;
};

export type BookingRow = {
  id: string;
  sessionDate: string;
  weekday: string;
  startLabel: string;
  endLabel: string;
  createdAt: string;
  student: PublicUser;
};
