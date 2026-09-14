import { requireAdmin } from "@/lib/auth";
import { listBookings, listSessionViews } from "@/lib/bookings";
import { listStudents, toPublicUser } from "@/lib/db";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    return Response.json({
      sessions: listSessionViews(),
      bookings: listBookings(),
      students: listStudents().map(toPublicUser),
    });
  } catch (error) {
    return jsonError(error);
  }
}
