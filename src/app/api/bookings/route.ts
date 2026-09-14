import { requireSession } from "@/lib/auth";
import { cancelMine, createBooking, listSessionViews } from "@/lib/bookings";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    if (session.role === "admin") {
      throw Object.assign(new Error("Admin accounts monitor the board; book from a student account."), {
        status: 403,
      });
    }
    const body = (await request.json()) as { date?: string };
    const date = String(body.date ?? "");
    createBooking(session.sub, date);
    return Response.json({ sessions: listSessionViews(session.sub) }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireSession();
    const body = (await request.json()) as { date?: string };
    const date = String(body.date ?? "");
    cancelMine(session.sub, date);
    return Response.json({ sessions: listSessionViews(session.sub) });
  } catch (error) {
    return jsonError(error);
  }
}
