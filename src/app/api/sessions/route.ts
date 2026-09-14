import { getSession } from "@/lib/auth";
import { listSessionViews } from "@/lib/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  const sessions = listSessionViews(session?.sub);
  return Response.json({ sessions });
}
