import { requireAdmin } from "@/lib/auth";
import { cancelBooking, getAdminOverview } from "@/lib/bookings";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = (await request.json()) as { id?: string };
    const id = String(body.id ?? "");
    if (!id) throw Object.assign(new Error("Missing booking id."), { status: 400 });
    cancelBooking(id, admin);
    return Response.json(getAdminOverview());
  } catch (error) {
    return jsonError(error);
  }
}
