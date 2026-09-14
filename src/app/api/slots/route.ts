import { listSlots } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const slots = await listSlots();
  return Response.json({ slots });
}
