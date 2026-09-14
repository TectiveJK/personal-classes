import { requireAdmin } from "@/lib/auth";
import { getAdminOverview } from "@/lib/bookings";
import { createUser, findUserByEmail, deleteStudent } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { notifyBookingsChanged } from "@/lib/realtime";
import { parseStudentFields } from "@/lib/student-fields";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as Record<string, unknown>;
    const fields = parseStudentFields(body);
    if (findUserByEmail(fields.email)) {
      throw Object.assign(new Error("An account with that email already exists."), { status: 409 });
    }
    createUser(fields);
    notifyBookingsChanged();
    return Response.json(getAdminOverview());
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as { id?: string };
    const id = String(body.id ?? "");
    if (!id) throw Object.assign(new Error("Missing student id."), { status: 400 });
    deleteStudent(id);
    notifyBookingsChanged();
    return Response.json(getAdminOverview());
  } catch (error) {
    return jsonError(error);
  }
}
