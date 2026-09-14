import { parseBookingInput } from "@/lib/booking-input";
import { createBooking, findBooking, findBookingsByEmail } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const email = searchParams.get("email");

  if (code) {
    const booking = await findBooking(code);
    if (!booking) {
      return Response.json({ error: "No booking found for that code." }, { status: 404 });
    }
    return Response.json({ bookings: [booking] });
  }

  if (email) {
    const bookings = await findBookingsByEmail(email);
    return Response.json({ bookings });
  }

  return Response.json(
    { error: "Look up a booking with an email address or confirmation code." },
    { status: 400 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseBookingInput(body);
    const booking = await createBooking(input);
    return Response.json({ booking }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not complete the booking.";
    const status = (error as { status?: number }).status ?? 400;
    return Response.json({ error: message }, { status });
  }
}
