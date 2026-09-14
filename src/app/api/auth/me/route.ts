import { getSession } from "@/lib/auth";
import { findUserById, toPublicUser } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ user: null });
  const row = findUserById(session.sub);
  if (!row) return Response.json({ user: null });
  return Response.json({ user: toPublicUser(row) });
}
