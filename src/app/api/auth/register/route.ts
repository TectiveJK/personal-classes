import { createUser, findUserByEmail } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+0-9()\s.-]{8,20}$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const password = String(body.password ?? "");

    if (name.length < 2) throw Object.assign(new Error("Enter your full name."), { status: 400 });
    if (!EMAIL.test(email)) throw Object.assign(new Error("Enter a valid email address."), { status: 400 });
    if (!PHONE.test(phone)) throw Object.assign(new Error("Enter a phone number we can reach."), { status: 400 });
    if (password.length < 8) {
      throw Object.assign(new Error("Password must be at least 8 characters."), { status: 400 });
    }
    if (findUserByEmail(email)) {
      throw Object.assign(new Error("An account with that email already exists."), { status: 409 });
    }

    const user = createUser({ name, email, phone, password });
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
