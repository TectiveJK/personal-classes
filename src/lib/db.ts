import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "@/lib/passwords";
import type { PublicUser, Role } from "@/lib/types";

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: Role;
  created_at: string;
};

const globalForDb = globalThis as typeof globalThis & { stgDb?: DatabaseSync };

function dbPath() {
  const dir = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), ".data");
  mkdirSync(dir, { recursive: true });
  return path.join(dir, "shaolin.db");
}

function createDb() {
  const db = new DatabaseSync(dbPath());
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      session_date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE (user_id, session_date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  seedAdmin(db);
  return db;
}

function seedAdmin(db: DatabaseSync) {
  const existing = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as
    | { id: string }
    | undefined;
  if (existing) return;
  const email = process.env.ADMIN_EMAIL ?? "admin@shaolintemplegreece.com";
  const password = process.env.ADMIN_PASSWORD ?? "ShaolinAdmin2026";
  db.prepare(
    `INSERT INTO users (id, name, email, phone, password_hash, role, created_at)
     VALUES (?, ?, ?, ?, ?, 'admin', ?)`
  ).run(
    crypto.randomUUID(),
    "Centre Administrator",
    email,
    "+30 211 267 2597",
    hashPassword(password),
    new Date().toISOString()
  );
}

export function getDb() {
  globalForDb.stgDb ??= createDb();
  return globalForDb.stgDb;
}

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
  };
}

export function findUserByEmail(email: string) {
  return getDb()
    .prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE")
    .get(email.trim()) as UserRow | undefined;
}

export function findUserById(id: string) {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
}

export function createUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  const db = getDb();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  db.prepare(
    `INSERT INTO users (id, name, email, phone, password_hash, role, created_at)
     VALUES (?, ?, ?, ?, ?, 'student', ?)`
  ).run(id, input.name.trim(), input.email.trim().toLowerCase(), input.phone.trim(), hashPassword(input.password), createdAt);
  return findUserById(id)!;
}

export function deleteStudent(id: string) {
  const user = findUserById(id);
  if (!user) throw Object.assign(new Error("Student not found."), { status: 404 });
  if (user.role !== "student") {
    throw Object.assign(new Error("The administrator account cannot be deleted."), { status: 403 });
  }
  getDb().prepare("DELETE FROM users WHERE id = ?").run(id);
  return user;
}

export function listStudents() {
  return getDb()
    .prepare("SELECT * FROM users WHERE role = 'student' ORDER BY created_at DESC")
    .all() as UserRow[];
}

export function listAllUsers() {
  return getDb().prepare("SELECT * FROM users ORDER BY role DESC, name ASC").all() as UserRow[];
}
