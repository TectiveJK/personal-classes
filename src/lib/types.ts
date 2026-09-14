export type ExperienceLevel =
  | "beginner"
  | "some-training"
  | "intermediate"
  | "advanced";

export type Discipline = {
  slug: string;
  name: string;
  chinese: string;
  durationMin: number;
  priceEur: number;
  level: string;
  summary: string;
  focus: string[];
  who: string;
};

export type Instructor = {
  id: string;
  dharmaName: string;
  chinese: string;
  civicName: string;
  generation: string;
  title: string;
  bio: string;
  disciplines: string[];
};

export type Slot = {
  id: string;
  date: string;
  time: string;
  weekday: string;
  available: boolean;
};

export type BookingStatus = "confirmed" | "cancelled";

export type Booking = {
  code: string;
  slotId: string;
  date: string;
  time: string;
  disciplineSlug: string;
  instructorId: string;
  studentName: string;
  email: string;
  phone: string;
  experience: ExperienceLevel;
  notes: string;
  status: BookingStatus;
  createdAt: string;
};

export type CreateBookingInput = {
  slotId: string;
  disciplineSlug: string;
  studentName: string;
  email: string;
  phone: string;
  experience: ExperienceLevel;
  notes?: string;
};
