import { cancelBooking, findBooking } from "@/lib/store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { code } = await context.params;
  const booking = await findBooking(code);
  if (!booking) {
    return Response.json({ error: "No booking found for that code." }, { status: 404 });
  }
  return Response.json({ booking });
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { code } = await context.params;
    const booking = await cancelBooking(code);
    return Response.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not cancel the booking.";
    const status = (error as { status?: number }).status ?? 400;
    return Response.json({ error: message }, { status });
  }
}
