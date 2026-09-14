import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { disciplines, primaryInstructor, school } from "@/lib/school";
import { findBooking } from "@/lib/store";
import { formatLongDate } from "@/lib/time";
import { CancelButton } from "@/components/cancel-button";

type PageProps = {
  params: Promise<{ code: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  return { title: `Booking ${code.toUpperCase()}` };
}

export default async function ConfirmPage({ params }: PageProps) {
  const { code } = await params;
  const booking = await findBooking(code);
  if (!booking) notFound();
  const discipline = disciplines.find((item) => item.slug === booking.disciplineSlug);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-gold uppercase">
        {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
      </p>
      <h1 className="font-heading mt-2 text-5xl">
        {booking.status === "confirmed" ? "Your place is held" : "This session was released"}
      </h1>
      <p className="mt-4 text-muted-foreground">
        Confirmation <span className="font-mono text-gold">{booking.code}</span>
      </p>

      <div className="mt-8 rounded-2xl border border-gold/25 bg-card p-6">
        <p className="font-heading text-3xl">{discipline?.name ?? "Private session"}</p>
        <p className="text-gold/80">{discipline?.chinese}</p>
        <dl className="mt-6 space-y-3 text-sm">
          <Row label="When" value={`${formatLongDate(booking.date)} · ${booking.time} (${school.timezone})`} />
          <Row label="Duration" value={`${discipline?.durationMin ?? 60} minutes`} />
          <Row label="Fee" value={`€${discipline?.priceEur ?? 50}, paid at the hall`} />
          <Row label="Student" value={booking.studentName} />
          <Row label="Instructor" value={`${primaryInstructor.dharmaName} ${primaryInstructor.chinese}`} />
          <Row label="Hall" value={school.address} />
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button render={<Link href="/bookings" />}>Find another booking</Button>
        <Button variant="outline" render={<Link href="/book" />}>
          Book again
        </Button>
        {booking.status === "confirmed" && <CancelButton code={booking.code} />}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/70 py-2 last:border-0 sm:flex-row sm:justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="sm:text-right">{value}</dd>
    </div>
  );
}
