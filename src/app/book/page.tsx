import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking-wizard";

export const metadata: Metadata = {
  title: "Book a session",
};

export default function BookPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-gold uppercase">Reserve</p>
      <h1 className="font-heading mt-2 text-5xl">Book a private session</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Choose the art, take an open hour, and leave your details. You will get a confirmation
        code to bring to the hall.
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading the booking board…</p>}>
          <BookingWizard />
        </Suspense>
      </div>
    </div>
  );
}
