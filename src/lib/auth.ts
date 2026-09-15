import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import type { Role } from "@/lib/types";

export type SessionPayload = {
  sub: string;
  name: string;
  email: string;
  role: Role;
};

const COOKIE = "stg_session";

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "stg-local-dev-secret-change-me");
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function readSessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret());
  if (!payload.sub || !payload.email || !payload.role) return null;
  return {
    sub: String(payload.sub),
    name: String(payload.name ?? ""),
    email: String(payload.email),
    role: payload.role === "admin" ? "admin" : "student",
  } satisfies SessionPayload;
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const store = await cookies();
  const proto = ((await headers()).get("x-forwarded-proto") ?? "").split(",")[0].trim();
  const secure =
    process.env.COOKIE_SECURE === "1" ||
    proto === "https" ||
    Boolean(process.env.VERCEL && process.env.COOKIE_SECURE !== "0");
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    return await readSessionToken(token);
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw Object.assign(new Error("Please sign in to continue."), { status: 401 });
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.role !== "admin") {
    throw Object.assign(new Error("Admin access only."), { status: 403 });
  }
  return session;
}
