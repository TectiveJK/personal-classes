import { requireAdmin } from "@/lib/auth";
import { getAdminOverview } from "@/lib/bookings";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    return Response.json(getAdminOverview());
  } catch (error) {
    return jsonError(error);
  }
}
