import type { Metadata } from "next";
import { ClassCard } from "@/components/class-card";
import { disciplines } from "@/lib/school";

export const metadata: Metadata = {
  title: "Classes",
};

export default function ClassesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-gold uppercase">Curriculum</p>
      <h1 className="font-heading mt-2 text-5xl">Personal class types</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Every booking is a private hour with Master Shi Yan Xiang at Shaolin Temple Greece.
        Group timetable energy stays in group class. Here the work is yours.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {disciplines.map((discipline) => (
          <ClassCard key={discipline.slug} discipline={discipline} />
        ))}
      </div>
    </div>
  );
}
