const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+0-9()\s.-]{8,20}$/;

export function parseStudentFields(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const password = String(body.password ?? "");

  if (name.length < 2) throw Object.assign(new Error("Enter the full name."), { status: 400 });
  if (!EMAIL.test(email)) throw Object.assign(new Error("Enter a valid email address."), { status: 400 });
  if (!PHONE.test(phone)) throw Object.assign(new Error("Enter a phone number we can reach."), { status: 400 });
  if (password.length < 8) {
    throw Object.assign(new Error("Password must be at least 8 characters."), { status: 400 });
  }

  return { name, email, phone, password };
}
