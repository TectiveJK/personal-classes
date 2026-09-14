import { findUserByEmail, toPublicUser } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { verifyPassword } from "@/lib/passwords";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");
    const user = findUserByEmail(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      throw Object.assign(new Error("Email or password is incorrect."), { status: 401 });
    }
    await setSessionCookie({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    return Response.json({ user: toPublicUser(user) });
  } catch (error) {
    return jsonError(error);
  }
}
