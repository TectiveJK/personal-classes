import { createUser, findUserByEmail } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { parseStudentFields } from "@/lib/student-fields";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const fields = parseStudentFields(body);
    if (findUserByEmail(fields.email)) {
      throw Object.assign(new Error("An account with that email already exists."), { status: 409 });
    }

    const user = createUser(fields);
    await setSessionCookie({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
