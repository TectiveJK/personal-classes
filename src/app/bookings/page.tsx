import type { Metadata } from "next";
import { BookingsLookup } from "@/components/bookings-lookup";

export const metadata: Metadata = {
  title: "My bookings",
};

export default function BookingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-gold uppercase">Desk</p>
      <h1 className="font-heading mt-2 text-5xl">Find your sessions</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Use the confirmation code from your receipt, or the email you booked with. You can
        release a time from here if your plans change.
      </p>
      <div className="mt-10">
        <BookingsLookup />
      </div>
    </div>
  );
}
