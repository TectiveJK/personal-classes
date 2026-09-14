import { disciplines, experienceLabels } from "@/lib/school";
import type { CreateBookingInput, ExperienceLevel } from "@/lib/types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+0-9()\s.-]{8,20}$/;

export function parseBookingInput(body: unknown): CreateBookingInput {
  if (!body || typeof body !== "object") {
    throw Object.assign(new Error("Send booking details as JSON."), { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const slotId = String(data.slotId ?? "").trim();
  const disciplineSlug = String(data.disciplineSlug ?? "").trim();
  const studentName = String(data.studentName ?? "").trim();
  const email = String(data.email ?? "").trim();
  const phone = String(data.phone ?? "").trim();
  const experience = String(data.experience ?? "").trim() as ExperienceLevel;
  const notes = String(data.notes ?? "").trim();

  if (!slotId) throw Object.assign(new Error("Choose a session time."), { status: 400 });
  if (!disciplines.some((item) => item.slug === disciplineSlug)) {
    throw Object.assign(new Error("Choose a class type."), { status: 400 });
  }
  if (studentName.length < 2) {
    throw Object.assign(new Error("Enter the student’s full name."), { status: 400 });
  }
  if (!EMAIL.test(email)) {
    throw Object.assign(new Error("Enter a valid email address."), { status: 400 });
  }
  if (!PHONE.test(phone)) {
    throw Object.assign(new Error("Enter a phone number we can reach."), { status: 400 });
  }
  if (!(experience in experienceLabels)) {
    throw Object.assign(new Error("Select an experience level."), { status: 400 });
  }
  if (notes.length > 600) {
    throw Object.assign(new Error("Keep notes under 600 characters."), { status: 400 });
  }

  return {
    slotId,
    disciplineSlug,
    studentName,
    email,
    phone,
    experience,
    notes,
  };
}
